# JessedWyatt.com - AI-Powered Personal Website

## Overview
JessedWyatt.com is a minimalist personal website centered around an AI chat interface that allows visitors to learn about Jesse's professional background, technical skills, and projects through natural conversation. The site emphasizes simplicity, beauty, and clarity in both design and functionality.

## Core Features
### AI Chat Interface
- A clean, modern chat UI where visitors can ask questions about Jesse
- Suggested starter questions to guide the conversation
- Real-time response generation using local LLM (Llama 3.2 via Ollama)
- Elegant dark mode design for optimal viewing

### Knowledge Base
- Structured collection of Markdown files containing information about:
  - Professional background
  - Technical skills
  - Project portfolio
  - Work experience
  - Educational background
  - Professional interests

### RAG Implementation
- Retrieval Augmented Generation (RAG) system that:
  - Indexes Markdown content for efficient retrieval
  - Matches user queries with relevant context
  - Generates accurate, contextual responses
  - Falls back gracefully when information is unavailable

## Technical Architecture
### Frontend
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Dark mode by default
- Responsive design for all devices

### Backend
- Next.js API routes
- Local LLM integration (Ollama)
- FAISS vector database for embeddings
- Markdown-based knowledge base

## Design Philosophy
- **Simplicity**: Clean, uncluttered interface focused on the chat experience
- **Beauty**: Elegant dark mode design with careful attention to typography and spacing
- **Clarity**: Clear, direct responses that accurately represent Jesse's background
- **Performance**: Fast, efficient local LLM processing without external API dependencies
- **Privacy**: No long-term data storage of user interactions

## Maintenance
- Knowledge base updates via Markdown files
- Simple deployment process
- Easy content management through text files
- Minimal dependencies for long-term sustainability

## Goals
1. Provide an engaging way for visitors to learn about Jesse's professional background
2. Demonstrate technical capabilities through the implementation itself
3. Create a memorable, unique personal website experience
4. Maintain high performance and reliability
5. Keep the system simple and maintainable

## Privacy & Ethics
- No collection of user data
- Clear about AI limitations
- Transparent about AI usage
- Respectful of user privacy
- Accurate representation of information