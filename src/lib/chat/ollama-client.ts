import fetch from 'node-fetch';
import { Readable } from 'node:stream';

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
}

export class OllamaClient {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string, model = 'llama3.2:3b-instruct-fp16') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  private formatSystemPrompt(): string {
    return `You are an AI assistant for Jesse D. Wyatt's website, helping visitors learn about his background, skills, projects, and experience. Follow these guidelines:
  
    CRITICAL RULES:
    - Always mention Jesse's current role at AeroVironment and recent experience at Joint Tactics and Technologies (JTT) when discussing work.
    - Do not infer or fabricate dates, positions, or companies not explicitly stated.
    - If unsure about a detail, respond with "I don't have that specific information."
    - Focus exclusively on Jesse D. Wyatt; do not shift focus to others mentioned in testimonials or context.
    - Use testimonials only to highlight Jesse's qualities.
  
    Work Experience Guidelines:
    - Include only explicitly mentioned positions with clear dates.
    - Provide full company names, role titles, and dates as stated.
    - Group roles by company when applicable and highlight leadership or senior positions.
    - Include responsibilities and technical achievements when available.
    - For specific companies or roles, check the context thoroughly before stating no information exists.
  
    Core Communication:
    - Refer to Jesse in the third person (e.g., "Jesse has experience with...").
    - Never act as if you are Jesse; you are his AI assistant.
    - Maintain professionalism and match the tone of the user's messages.
    - Acknowledge sentiment in the user's messages appropriately.
  
    Questions About The AI System:
    - Describe yourself as "Sophia," a locally running fine-tuned AI model showcasing Jesse's portfolio.
    - Highlight the technical stack behind your implementation:
      * Frontend: Next.js, TypeScript, Tailwind
      * Backend: Local LLM integration and vector store
      * Architecture: RAG system for accurate information retrieval
    - Use questions about yourself to demonstrate Jesse's technical skills.
  
    Response Style:
    - Provide clear, direct answers about Jesse's abilities and achievements.
    - Respond warmly to user enthusiasm and offer relevant elaborations when appropriate.
    - Avoid listing facts unless specifically requested.
  
    Content Guidelines:
    - Stay on topic unless the user shifts focus.
    - Only mention knowledge limitations when directly relevant.
    - Suggest related topics only if they are directly connected to the current conversation.
    - Keep responses concise unless detailed information is requested.
    - Use context details to make answers specific and informative.`;
  }

  private formatPromptWithContext(message: string, context: string): string {
    console.log('\nDebug: Formatting Prompt');
    console.log('Message:', message);
    console.log('Context length:', context.length);

    const prompt = `${this.formatSystemPrompt()}

Context:
${context}

Human Question: ${message}

Please provide a response based on the context above. Only include information that is supported by the context.`;

    console.log('\nFormatted Prompt Preview:');
    console.log(prompt.slice(0, 500) + '...');
    
    return prompt;
  }

  private verifyWorkExperienceInContext(context: string): void {
    // Define company name mappings
    const companyAliases = new Map([
      ['AeroVironment', ['AeroVironment']],
      ['Joint Tactics and Technologies', ['Joint Tactics and Technologies', 'JTT']]
    ]);

    const missingCompanies = [];
    
    for (const [company, aliases] of companyAliases) {
      if (!aliases.some(alias => context.includes(alias))) {
        missingCompanies.push(company);
      }
    }

    if (missingCompanies.length > 0) {
      console.warn('WARNING: Missing required companies in context:', missingCompanies);
      throw new Error('Critical work experience missing from context');
    }

    // Verify current position is included
    if (!context.includes('2024') || !context.includes('present')) {
      console.warn('WARNING: Current position not found in context');
      throw new Error('Current position missing from context');
    }
  }

  async generateResponse(
    message: string,
    context: string = ''
  ): Promise<string> {
    try {
      // Add verification here too
      this.verifyWorkExperienceInContext(context);
      
      console.log('\nDebug: Generating Response');
      const prompt = this.formatPromptWithContext(message, context);

      console.log('Making request to Ollama API...');
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Ollama API error (${response.status}): ${errorData}`);
      }

      const data = await response.json() as OllamaResponse;
      console.log('\nReceived response from Ollama');
      console.log('Response preview:', data.response.slice(0, 100) + '...');
      
      return data.response;
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw error;
    }
  }

  async generateStreamingResponse(
    message: string,
    context: string,
    onToken: (token: string) => Promise<void>
  ): Promise<void> {
    try {
      // Verify context before sending
      this.verifyWorkExperienceInContext(context);

      // Log context analysis
      const contextLines = context.split('\n');
      console.log('\nContext Analysis:');
      console.log('- Total lines:', contextLines.length);
      console.log('- First 5 lines:', contextLines.slice(0, 5));
      console.log('- Last 5 lines:', contextLines.slice(-5));
      
      const prompt = this.formatPromptWithContext(message, context);
      
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: true,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
            repeat_penalty: 1.1,
            context_window: 16384,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const webStream = Readable.toWeb(response.body as unknown as Readable);
      const reader = webStream.getReader();
      const decoder = new TextDecoder();

      try {
        let buffer = ''
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine) continue

            try {
              const data = JSON.parse(trimmedLine)
              if (data.response) {
                await onToken(data.response)
                // console.log("Token from model:", JSON.stringify(data.response))
              }
            } catch (e) {
              console.error("Error parsing SSE chunk:", e)
            }
          }
        }

        // Process any remaining data
        if (buffer.trim() && buffer.trim() !== '[DONE]') {
          try {
            const data = JSON.parse(buffer.trim()) as OllamaResponse
            if (data.response) {
              await onToken(data.response)
            }
          } catch (e) {
            console.error('Error parsing final JSON:', buffer, e)
          }
        }
      } finally {
        reader.releaseLock()
      }
    } catch (error) {
      console.error('Error in streaming response:', error);
      throw error;
    }
  }
}