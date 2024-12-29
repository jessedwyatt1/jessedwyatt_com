"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Loader2, Bot, User, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Message } from "@/types/chat"
import { cn } from "@/lib/utils"
import { marked } from 'marked'
import { useTheme } from "@/lib/theme-context"

const suggestedQuestions = [
  "What are Jesse's latest projects?",
  "What are Jesse's top technical skills?",
  "What's Jesse's professional background?"
]

function formatMessage(content: string): React.ReactNode {
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true
  })

  // Convert markdown to HTML
  const html = marked(content)

  return (
    <div 
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function ChatInterface() {
  const { mode } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('chatCollapsed')
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('chatCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }

  useEffect(() => {
    // Only scroll if messages exist and the last message is complete (not streaming)
    if (messages.length > 0 && !isLoading) {
      const lastMessage = messages[messages.length - 1];
      const behavior = lastMessage.role === "user" ? "smooth" : "auto";
      scrollToBottom(behavior);
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    setMessages(prev => [...prev, { role: "user", content: text }])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "text/event-stream" 
        },
        body: JSON.stringify({ message: text })
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      // Add an empty assistant message that we'll update
      setMessages(prev => [...prev, { role: "assistant", content: "" }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
      
        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())
      
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataString = line.slice(5).trim()
      
            // Skip if it's just [DONE]
            if (dataString === "[DONE]") {
              console.log("Stream finished.")
              break
            }
      
            try {
              const data = JSON.parse(dataString)
              if (data.token) {
                setMessages(prev => {
                  // Create a new array reference
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  if (lastMessage.role === 'assistant') {
                    // Create a new message object to ensure React detects the change
                    newMessages[newMessages.length - 1] = {
                      ...lastMessage,
                      content: lastMessage.content + data.token
                    }
                  }
                  return newMessages
                })
              }
            } catch (err) {
              console.error("Stream JSON parse error:", err, dataString)
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Chat API Error:', error)
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className={cn(
      "fixed bottom-4 right-4 w-[calc(100%-2rem)] md:w-[400px] border border-border/50 rounded-2xl overflow-hidden shadow-lg max-h-[80vh] flex flex-col",
      mode === 'professional' 
        ? "bg-slate-700/75 backdrop-blur-sm"
        : "bg-blue-950/75 border-blue-800/50 backdrop-blur-sm"
    )}>
      <div className="flex items-center justify-between p-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-medium">Sophia - Portfolio AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand chat" : "Collapse chat"}
        >
          {isCollapsed ? (
            <ChevronUp className="h-6 w-6" />
          ) : (
            <ChevronDown className="h-6 w-6" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages container */}
          <div className={cn(
            "flex-1 overflow-y-auto p-4 space-y-4 min-h-0",
            mode === 'professional' 
              ? "bg-slate-700/75"
              : "bg-blue-950/75"
          )}>
            {/* Messages */}
            {messages.length === 0 && (
              <div className="text-center text-sm text-slate-300 my-4">
                <p>👋 Hi! I&apos;m Sophia, a locally running fine-tuned AI model Jesse put together to showcase his portfolio.</p>
                <p className="mt-3">LLMs can make mistakes! Bare with me while I learn.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2.5",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-2 rounded-lg leading-relaxed",
                    message.role === "user"
                      ? "bg-blue-700 text-white font-medium rounded-tr-none"
                      : "bg-muted rounded-tl-none"
                  )}
                >
                  {formatMessage(message.content)}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted px-4 py-2 rounded-lg rounded-tl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

            {/* Suggested Questions */}
            {messages.length === 0 && (
              <div className="p-4 border-t border-border/50 bg-slate-800/50">
                <p className="text-sm text-muted-foreground mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(question)}
                      className="text-sm px-3 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className={cn(
            "border-t border-border/50 p-4 shrink-0",
            mode === 'professional' 
              ? "bg-slate-600/50" 
              : "bg-blue-950/50"
          )}>
            <div className="flex space-x-2">
              <Button
                onClick={clearChat}
                variant="ghost"
                size="default"
                className="rounded-full hover:bg-background/60"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Ask me anything about Jesse..."
                className="flex-1 px-4 py-2 bg-background/60 text-foreground border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <Button 
                onClick={() => handleSend(input)}
                disabled={isLoading || !input.trim()}
                size="default"
                className="rounded-full"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}