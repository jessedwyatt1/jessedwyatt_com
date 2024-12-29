---
title: "The Complete Blog Post Style Guide"
date: "2024-03-27"
description: "A comprehensive demonstration of all available styling options, components, and formatting features available in the blog system. Use this post as a reference when creating content."
tags: ["Style Guide", "Markdown", "Documentation", "Examples", "Reference"]
project:
  name: "Blog Platform"
  github: "https://github.com/jessedwyatt1/jessedwyatt_com"
  live: "https://jessedwyatt.com/blog"
---

# The Complete Blog Post Style Guide

Welcome to the comprehensive style guide for our blog platform. This post demonstrates every available styling element and serves as a living reference for content creators. You'll find examples of text formatting, code blocks, custom components, and more.

## Basic Text Formatting

This is a standard paragraph with various text formatting options:

- Here's **bold text** using double asterisks
- Here's *italicized text* using single asterisks
- Here's ***bold and italicized text*** using triple asterisks
- Here's `inline code` using backticks
- Here's a [link to another page](/blog) using standard markdown
- Here's an [external link](https://github.com) that opens in a new tab

## Blockquotes

Blockquotes are perfect for highlighting important information:

> This is a blockquote. Use it to make certain text stand out or to quote external sources.
> 
> You can include multiple paragraphs in a blockquote by adding a blank line with a '>' character.
>
> Pro tip: Blockquotes are great for highlighting key takeaways or important warnings.

## Lists

### Unordered Lists
- Main item one
  - Sub-item A
  - Sub-item B
    - Even deeper item
    - Another deep item
  - Sub-item C
- Main item two
- Main item three

### Ordered Lists
1. First step in the process
   1. Sub-step one
   2. Sub-step two
2. Second step in the process
   - Important note about step two
   - Another note
3. Third step in the process

### Mixed List Types
1. Major process step
   - Supporting detail
   - Additional information
     1. Detailed instruction
     2. Another instruction
   - Final detail
2. Next major step

## Code Examples

### Inline Code
Use `const` instead of `let` when declaring variables that won't be reassigned. You can also use the `useMemo` hook for performance optimization.

### TypeScript/React Example
```typescript
interface UserProps {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const UserProfile: React.FC<UserProps> = ({ name, email, role }) => {
  const isAdmin = useMemo(() => role === 'admin', [role]);

  return (
    <div className="user-profile">
      <h2>{name}</h2>
      <p>{email}</p>
      {isAdmin && <AdminPanel />}
    </div>
  );
};
```

### Python Example
```python
from typing import List, Dict

def process_data(items: List[str]) -> Dict[str, int]:
    """
    Process a list of items and return frequency count.
    
    Args:
        items: List of strings to process
        
    Returns:
        Dictionary with item counts
    """
    return {
        item: items.count(item)
        for item in set(items)
    }
```

### Shell/Bash Example
```bash
#!/bin/bash
# Deploy the application
npm run build
docker build -t myapp .
docker push myapp:latest
```

## Tables

### Simple Table
| Feature | Description | Status |
|---------|-------------|--------|
| Auth | JWT-based authentication | ✅ |
| API | RESTful endpoints | ✅ |
| Cache | Redis implementation | 🚧 |

### Aligned Table
| Left | Center | Right |
|:-----|:------:|------:|
| Text | Text | Text |
| Longer text | Centered | 123 |
| A | B | C |

## Custom Components

### Collapsible Sections
<details>
<summary>Click to view implementation details</summary>

Here's the detailed implementation:

```typescript
interface Config {
  feature: boolean;
  timeout: number;
}

const defaultConfig: Config = {
  feature: true,
  timeout: 1000
};
```

You can modify these values as needed.
</details>

### Technical Notes
:::note
This is a note component. Use it for supplementary information or helpful tips that don't fit in the main flow.
:::

:::warning
This is a warning component. Use it for important cautionary information or potential pitfalls.
:::

:::tip
This is a tip component. Use it for best practices and recommendations.
:::

## Images

### Standard Image
![Dashboard Overview](/blog/example/dashboard.png)

### Image with Custom Size
<img src="/blog/example/detail.png" alt="Detailed View" width="600" />

### Image with Caption
<figure>
  <img src="/blog/example/architecture.png" alt="System Architecture" width="800" />
  <figcaption>Figure 1: High-level system architecture diagram showing key components</figcaption>
</figure>

## Technical Documentation

### API Documentation
```typescript
interface APIResponse<T> {
  data: T;
  status: 'success' | 'error';
  timestamp: string;
  message?: string;
}

class APIClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }
}
```

### Configuration Examples
```yaml
# Docker Compose configuration
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      REDIS_URL: redis://cache
```

```json
{
  "name": "blog-platform",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## Advanced Formatting

### Definition Lists
Term 1
: Definition of first term
: Additional details about first term

Term 2
: Definition of second term

### Keyboard Commands
Use <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy text.

### Abbreviations
The HTML specification is maintained by the W3C.
*[HTML]: HyperText Markup Language
*[W3C]: World Wide Web Consortium

## Best Practices Checklist

- [ ] Use descriptive headings
- [ ] Include relevant code examples
- [ ] Add helpful images and diagrams
- [ ] Maintain consistent formatting
- [ ] Check all links
- [ ] Proofread content
- [ ] Test code snippets
- [ ] Optimize images

## Summary

This post demonstrates all available styling options and components. When writing your own posts:

1. Choose appropriate elements for your content
2. Maintain consistent styling
3. Use headings logically
4. Include relevant examples
5. Add helpful visuals
6. Keep code snippets concise and focused

---

*Last updated: March 27, 2024*