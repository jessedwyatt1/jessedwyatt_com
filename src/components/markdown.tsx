"use client"

import { marked } from 'marked';
import { useMemo, useEffect, useState } from 'react';
import { TableOfContents } from './blog/table-of-contents';

interface MarkdownProps {
  content: string;
}

interface TOCItem {
  id: string;
  text: string;
  depth: number;
  children: TOCItem[];
}

interface MarkedToken {
  type: string;
  depth?: number;
  text?: string;
  tokens?: Array<{ type: string; text?: string }>;
}

function buildTableOfContents(tokens: MarkedToken[]): TOCItem[] {
  const items: TOCItem[] = [];
  const stack: { items: TOCItem[], depth: number }[] = [{ items, depth: 0 }];

  tokens.forEach((token) => {
    if (token.type === 'heading' && token.depth && token.text) {
      const text = token.text;
      const depth = token.depth;
      
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const item: TOCItem = {
        id,
        text,
        depth,
        children: []
      };

      while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
        stack.pop();
      }

      stack[stack.length - 1].items.push(item);

      if (depth < 3) {
        stack.push({ items: item.children, depth });
      }
    }
  });

  return items;
}

export function Markdown({ content }: MarkdownProps) {
  const [activeId, setActiveId] = useState<string>('');
  
  const { html, tableOfContents } = useMemo(() => {
    const tokens = marked.lexer(content);
    
    // Find and remove the first h1 token
    const firstH1Index = tokens.findIndex(token => 
      token.type === 'heading' && token.depth === 1
    );
    if (firstH1Index !== -1) {
      tokens.splice(firstH1Index, 1);
    }
    
    const toc = buildTableOfContents(tokens);
    const html = marked.parser(tokens);
    
    return {
      html,
      tableOfContents: toc
    };
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  return (
    <div className="relative lg:flex lg:gap-12">
      {/* Main content */}
      <article className="prose prose-invert max-w-none flex-1">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      {/* Table of Contents sidebar */}
      <aside className="hidden lg:block w-64 relative">
        <div className="sticky top-24 toc-nav">
          <h3 className="font-semibold mb-4">Table of Contents</h3>
          <TableOfContents items={tableOfContents} activeId={activeId} />
        </div>
      </aside>
    </div>
  );
}