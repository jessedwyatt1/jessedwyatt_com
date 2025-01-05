"use client"

import { marked } from 'marked';
import type { Tokens } from 'marked';
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

interface HeadingToken {
  tokens?: Array<{ type: string; text?: string }>;
  depth: number;
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
    const renderer = new marked.Renderer();
    
    // Add heading renderer with proper typing
    renderer.heading = function({ tokens, depth }: HeadingToken): string {
      const text = tokens?.[0]?.text || '';
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    };
    
    // Update link renderer to match the Link token type
    renderer.link = function({ href, title, text }: Tokens.Link): string {
      if (!href) return text;
      const isExternal = href.startsWith('http') || href.startsWith('https');
      const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${attrs}${title ? ` title="${title}"` : ''}>${text}</a>`;
    };
    
    // More flexible regex that handles various spacing
    const customBlockRegex = /^[ \t]*:::(\w+)[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*$/gm;

    // Process the content first to handle custom blocks
    const processedContent = content.replace(
      customBlockRegex,
      (_, type, content) => {
        return `<div class="custom-block ${type}">\n${content.trim()}\n</div>`;
      }
    );

    const tokens = marked.lexer(processedContent);
    
    // Find and remove the first h1 token
    const firstH1Index = tokens.findIndex(token => 
      token.type === 'heading' && token.depth === 1
    );
    if (firstH1Index !== -1) {
      tokens.splice(firstH1Index, 1);
    }
    
    const toc = buildTableOfContents(tokens);
    const html = marked.parser(tokens, { renderer });
    
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
        <div className="sticky top-24">
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-800/50">
            <h3 className="font-semibold mb-4">Table of Contents</h3>
            <div className="toc-nav">
              <TableOfContents items={tableOfContents} activeId={activeId} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}