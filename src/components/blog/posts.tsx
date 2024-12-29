"use client"

import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink, Calendar } from 'lucide-react';
import { BlogPostMeta } from '@/lib/blog/types';

const POSTS_PER_PAGE = 5;

interface BlogPostsProps {
  initialPosts: BlogPostMeta[];
  totalPosts: BlogPostMeta[];
}

export function BlogPosts({ initialPosts, totalPosts }: BlogPostsProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView && posts.length < totalPosts.length) {
      const nextPage = page + 1;
      const start = (nextPage - 1) * POSTS_PER_PAGE;
      const end = start + POSTS_PER_PAGE;
      const newPosts = totalPosts.slice(start, end);
      
      setPosts(prev => [...prev, ...newPosts]);
      setPage(nextPage);
    }
  }, [inView, page, posts.length, totalPosts]);

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article key={post.slug} className="p-6 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4" />
            {new Date(post.date).toLocaleDateString()}
          </div>
          
          <Link href={`/blog/post/${post.slug}`}>
            <h2 className="text-2xl font-semibold mb-2 hover:text-blue-400 transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-muted-foreground mb-4">
            {post.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-slate-800">
                {tag}
              </Badge>
            ))}
          </div>

          {post.project && (
            <div className="flex gap-3 text-sm text-muted-foreground">
              {post.project.github && (
                <a href={post.project.github} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <Github className="w-4 h-4" />
                  View Code
                </a>
              )}
              {post.project.live && (
                <a href={post.project.live} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </article>
      ))}

      {/* Intersection Observer target */}
      {posts.length < totalPosts.length && (
        <div ref={ref} className="h-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400" />
        </div>
      )}
    </div>
  );
} 