import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog/utils';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink, Calendar } from 'lucide-react';

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Blog & Project Deep Dives
        </h1>
        <p className="text-muted-foreground mb-12">
          Technical articles, project deep dives, and development insights
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="p-6 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              
              <Link href={`/blog/${post.slug}`}>
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
        </div>
      </div>
    </div>
  );
} 