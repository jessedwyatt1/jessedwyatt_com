import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
import { getBlogPost, getBlogPosts } from "@/lib/blog/utils";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug.split('/')
  }));
}

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPost(slug.join('/'));

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage(props: PageProps) {
  const { slug } = await props.params;
  const post = await getBlogPost(slug.join('/'));

  if (!post) {
    notFound();
  }

  return (
    <div className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-blue-400 transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="mb-8 p-6 bg-slate-900/50 rounded-lg border border-slate-800">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-800">
                    {tag}
                  </Badge>
                ))}
              </div>

              {post.project && (
                <div className="flex gap-3 text-sm text-muted-foreground pt-4 border-t border-slate-800">
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
            </div>

            <Markdown content={post.content} />
          </div>
        </div>
      </div>
    </div>
  );
}