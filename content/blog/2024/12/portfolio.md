---
title: "JesseDWyatt.com: Building a Modern Portfolio with AI-Powered Chat"
date: "2024-12-27"
description: "A deep dive into the development of this very website you're reading - JesseDWyatt.com is a modern portfolio featuring an AI-powered chat interface, built entirely from scratch without reliance on CMS platforms or website builders. Running on custom-built hardware and a homegrown security stack, this Next.js and TypeScript application showcases what's possible with modern web development. This article, hosted on the platform it describes, explores the architectural decisions, technical challenges, and innovative solutions implemented in its own creation."
tags: ["Next.js", "TypeScript", "AI", "LLM", "Tailwind CSS", "React", "Portfolio"]
project:
  name: "jessedwyatt.com"
  github: "https://github.com/jessedwyatt1/jessedwyatt_com"
  live: "https://jessedwyatt.com"
social:
  image: "/blog/default-blog.png"
  title: "JesseDWyatt.com: Building a Modern Portfolio with AI-Powered Chat"
  description: "A deep dive into the development of this very website you're reading - JesseDWyatt.com is a modern portfolio featuring an AI-powered chat interface, built entirely from scratch without reliance on CMS platforms or website builders. Running on custom-built hardware and a homegrown security stack, this Next.js and TypeScript application showcases what's possible with modern web development. This article, hosted on the platform it describes, explores the architectural decisions, technical challenges, and innovative solutions implemented in its own creation."
---

# jessedwyatt.com: Building a Modern Portfolio with AI-Powered Chat

## Introduction

Creating a personal website that truly stands out in today's digital landscape requires more than just a clean design and responsive layout. You're currently experiencing this firsthand - this very article is hosted on the platform it describes, running on custom-built hardware and infrastructure rather than traditional hosting solutions or website builders like WordPress or Squarespace. Every aspect, from the security stack to the AI integration, has been built from the ground up, showcasing the integration of modern web technologies with AI capabilities. With the rise of AI and the increasing sophistication of web technologies, I've tried to create something truly interactive and engaging, which you can explore throughout this site.

## The Vision

### Beyond the Traditional Portfolio

The traditional portfolio website follows a familiar pattern: a collection of static pages showcasing work experience, projects, and skills. While effective, this approach lacks the interactive element that modern web users have come to expect. The vision for jessedwyatt.com was to create something more dynamic - a platform that not only presents information but engages with visitors in a meaningful way.

### The AI Assistant Concept

The core innovation of the site is Sophia, an AI assistant that helps visitors explore my background, skills, and experience. Unlike typical chatbots that rely on pre-programmed responses, Sophia uses a local Large Language Model (LLM) with Retrieval Augmented Generation (RAG) to provide accurate, context-aware responses about my professional background.

## Technical Architecture

### Frontend Framework Selection

The project is built on Next.js 15, leveraging its latest features for optimal performance and developer experience:

1. **React Server Components**
   - Efficient server-side rendering
   - Reduced client-side JavaScript
   - Improved initial page load performance

2. **TypeScript Integration**
   - Strong type safety throughout the application
   - Enhanced developer experience with IDE support
   - Reduced runtime errors through compile-time checking

3. **Tailwind CSS**
   - Utility-first styling approach
   - Dark mode implementation
   - Custom theme configuration for consistent branding

### AI Integration Architecture

The AI system is built around three core components:

1. **Local LLM Integration**
   - Ollama integration for local model hosting
   - Custom model fine-tuning for portfolio-specific responses
   - Streaming responses for natural conversation flow

2. **Vector Store Implementation**
   - In-memory vector storage for efficient retrieval
   - Custom document chunking strategies
   - Semantic search capabilities

3. **RAG System**
   - Dynamic context retrieval based on user queries
   - Intelligent document prioritization
   - Real-time response generation with context integration

## Core Features and Implementation

### Modern Dashboard Interface

The website features two distinct themes - professional and personal - each with its own aesthetic while maintaining consistent functionality:

```typescript
export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const mode = pathname.startsWith('/personal') ? 'personal' : 'professional'

  return (
    <ThemeContext.Provider value={{ mode }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### AI Chat Implementation

The chat interface is built with several key features:

1. **Real-time Streaming**
   - Server-Sent Events for streaming responses
   - Chunked response processing
   - Smooth typing animation effect

2. **Context Management**
   - Dynamic context retrieval based on user queries
   - Intelligent document prioritization
   - Semantic chunking for optimal context windows

3. **Memory Store**
   - Efficient vector storage implementation
   - Custom document processing pipeline
   - Real-time embedding generation

### Content Management

The site uses a markdown-based content management system:

1. **Blog System**
   - Organized by year/month structure
   - Frontmatter for metadata
   - Dynamic route generation

2. **Project Showcases**
   - Rich project descriptions
   - Technical stack highlights
   - Live demo links

3. **Professional Experience**
   - Timeline-based display
   - Company-specific sections
   - Skill categorization

## Performance Optimizations

### Frontend Optimizations

Several techniques are employed to ensure optimal performance:

1. **Code Splitting**
   - Dynamic imports for route-based code splitting
   - Component-level code splitting
   - Efficient chunk management

2. **Image Optimization**
   - Next.js Image component usage
   - Responsive image sizing
   - Automatic WebP conversion

3. **Style Optimization**
   - Tailwind's JIT compiler
   - CSS purging
   - Critical CSS extraction

### AI Response Optimization

The AI system is optimized for both speed and accuracy:

1. **Context Management**
   - Smart chunking strategies
   - Priority-based retrieval
   - Cache management

2. **Response Generation**
   - Streaming response handling
   - Efficient token processing
   - Memory management

## Security Implementation

Security is a crucial aspect of the site, implemented through several layers:

1. **Authentication System**
   - Secure cookie-based authentication
   - Password hashing with crypto
   - Protected API routes

2. **API Security**
   - Rate limiting
   - Input validation
   - CORS configuration

3. **Environment Security**
   - Secure environment variable handling
   - Production configuration
   - Error handling

## Deployment Architecture

The application is containerized using Docker for consistent deployment:

```yaml
version: '3.8'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8888:3000"
    env_file:
      - .env.local
```

## Future Development

### Planned Enhancements

The roadmap includes several major features:

1. **Enhanced AI Capabilities**
   - Multi-turn conversation support
   - Context-aware memory system
   - Advanced query understanding

2. **Content Expansion**
   - Interactive project demos
   - Technical blog integration
   - Resource library

3. **UI/UX Improvements**
   - Advanced animations
   - Improved mobile experience
   - Accessibility enhancements

## Conclusion

Building jessedwyatt.com has been an exercise in combining modern web technologies with AI capabilities to create a unique portfolio experience. The project demonstrates how AI can be integrated into web applications in a meaningful way, providing value to users while maintaining performance and security.

The combination of Next.js, TypeScript, and local LLM integration creates a foundation for future enhancements while delivering a polished and professional experience today. As AI technology continues to evolve, this platform is well-positioned to incorporate new capabilities and features.

---

*Last updated: December 27, 2024*