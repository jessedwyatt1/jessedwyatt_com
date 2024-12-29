"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Save, X } from "lucide-react";
import { Project, ProjectWithId } from "@/lib/projects/types";
import { BlogPostMeta } from "@/lib/blog/types";
import { SearchCombobox } from "@/components/ui/search-combobox";

interface Props {
  project?: ProjectWithId;
  mode: "create" | "edit";
}

interface FormData extends Omit<Project, 'tech' | 'features'> {
  tech: string;
  features: string;
  showOnPersonalPage: boolean;
}

export function ProjectEditor({ project, mode }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPostMeta[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: project?.title ?? "",
    description: project?.description ?? "",
    tech: project?.tech.join(", ") ?? "",
    features: project?.features.join(", ") ?? "",
    github: project?.github ?? "",
    live: project?.live ?? "",
    blogUrl: project?.blogUrl ?? "",
    isPublic: project?.isPublic ?? true,
    privateReason: project?.privateReason ?? "",
    showOnPersonalPage: project?.showOnPersonalPage ?? true,
  });

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/admin/blog/posts');
        if (!response.ok) throw new Error('Failed to fetch blog posts');
        const data = await response.json();
        setBlogPosts(data.posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError("");

      const projectData: Project = {
        title: formData.title,
        description: formData.description,
        tech: formData.tech.split(",").map(t => t.trim()).filter(Boolean),
        features: formData.features.split("\n").map(f => f.trim()).filter(Boolean),
        github: formData.github || undefined,
        live: formData.live || undefined,
        blogUrl: formData.blogUrl || undefined,
        isPublic: formData.isPublic,
        privateReason: formData.privateReason || undefined,
        showOnPersonalPage: formData.showOnPersonalPage,
      };

      const url = mode === "create" 
        ? "/api/admin/projects" 
        : `/api/admin/projects/${project?.id}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error("Failed to save project");

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error("Error saving project:", error);
      setError("Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlogPostSelect = (blogUrl: string | null) => {
    // Prevent form submission
    if (window.event) {
      window.event.preventDefault();
    }
    
    setFormData(prev => ({
      ...prev,
      blogUrl: blogUrl || ''  // Handle null case by setting empty string
    }));
  };

  const blogPostOptions = blogPosts.map(post => ({
    value: `/blog/post/${post.slug}`,
    label: post.title
  }));

  if (!isLoggedIn) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>You must be logged in to access this page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {mode === "create" ? "New Project" : "Edit Project"}
          </h1>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Project title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Project description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
          <Input
            value={formData.tech}
            onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
            placeholder="Next.js, TypeScript, Tailwind CSS"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Features (one per line)</label>
          <Textarea
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL (optional)</label>
            <Input
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value || undefined })}
              placeholder="https://github.com/username/repo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Live URL (optional)</label>
            <Input
              value={formData.live}
              onChange={(e) => setFormData({ ...formData, live: e.target.value || undefined })}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Blog Post (optional)</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchCombobox
                options={blogPostOptions}
                value={formData.blogUrl}
                onChange={handleBlogPostSelect}
                placeholder="Select a blog post..."
              />
            </div>
            {formData.blogUrl && (
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => handleBlogPostSelect(null)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            className="h-4 w-4"
          />
          <label className="text-sm font-medium">Public Repository</label>
        </div>

        {!formData.isPublic && (
          <div>
            <label className="block text-sm font-medium mb-2">Private Reason</label>
            <Input
              value={formData.privateReason}
              onChange={(e) => setFormData({ ...formData, privateReason: e.target.value || undefined })}
              placeholder="Why is this repository private?"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.showOnPersonalPage}
            onChange={(e) => setFormData({ ...formData, showOnPersonalPage: e.target.checked })}
            className="h-4 w-4"
          />
          <label className="text-sm font-medium">Show on Personal Page</label>
        </div>
      </form>
    </div>
  );
} 