"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, RefreshCw, Trash, Edit } from "lucide-react";
import { BlogPostMeta } from "@/lib/blog/types";
import { Badge } from "@/components/ui/badge";

export function BlogPostManager() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch('/api/admin/blog/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      setError('Failed to fetch blog posts');
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchPosts();
    }
  }, [isLoggedIn]);

  const deletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(`/api/admin/blog/posts/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');
      
      await fetchPosts();
    } catch (error) {
      setError('Failed to delete post');
      console.error('Error deleting post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container max-w-4xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You must be logged in to access this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <div className="flex gap-2">
          <Button onClick={fetchPosts} variant="secondary" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <a href="/admin/blog/new">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </a>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.slug} className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-2">{post.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Published: {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/admin/blog/edit/${post.slug}`}>
                    <Edit className="w-4 h-4" />
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deletePost(post.slug)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 