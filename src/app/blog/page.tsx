import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog/utils';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink, Calendar } from 'lucide-react';
import { BlogPostMeta } from '@/lib/blog/types';

interface GroupedPosts {
  [year: string]: {
    [month: string]: BlogPostMeta[];
  };
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
  // Group posts by year and month
  const groupedPosts = posts.reduce<GroupedPosts>((acc, post) => {
    const date = new Date(post.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    
    acc[year][month].push(post);
    return acc;
  }, {});

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts Grid */}
          <div className="flex-1 space-y-8">
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
          </div>

          {/* Archive Navigation */}
          <div className="lg:w-24 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Archive</h2>
            {Object.entries(groupedPosts)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, months]) => (
                <div key={year} className="space-y-2">
                  <h3 className="font-medium text-blue-400">{year}</h3>
                  <ul className="space-y-1 pl-4">
                    {Object.entries(months)
                      .sort(([a], [b]) => Number(b) - Number(a))
                      .map(([month]) => (
                        <li key={month}>
                          <Link 
                            href={`/blog/archive/${year}/${month}`}
                            className="text-muted-foreground hover:text-blue-400 transition-colors"
                          >
                            {monthNames[Number(month) - 1]}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 