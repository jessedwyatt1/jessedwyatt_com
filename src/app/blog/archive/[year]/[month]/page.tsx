import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/blog/utils";

interface Props {
  params: Promise<{
    year: string;
    month: string;
  }>;
}

export default async function BlogArchivePage({ params }: Props) {
  const { year, month } = await params;
  const allPosts = await getBlogPosts();
  
  const posts = allPosts.filter(post => {
    const postDate = new Date(post.date);
    return (
      postDate.getFullYear().toString() === year &&
      (postDate.getMonth() + 1).toString().padStart(2, '0') === month
    );
  });

  if (posts.length === 0) {
    notFound();
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container max-w-4xl">
        <Link href="/blog" className="text-muted-foreground hover:text-blue-400 transition-colors mb-8 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          {monthNames[parseInt(month, 10) - 1]} {year}
        </h1>

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
        </div>
      </div>
    </div>
  );
} 