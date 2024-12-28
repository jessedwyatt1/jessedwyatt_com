"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Save, X } from "lucide-react";
import { BlogPost } from "@/lib/blog/types";
import { generateFrontmatter, generateSlug } from "@/lib/blog/client-utils";

interface Props {
  post?: BlogPost;
  mode: "create" | "edit";
}

interface FormData {
  title: string;
  description: string;
  content: string;
  tags: string;
  date: string;
  project: {
    name: string;
    github: string;
    live: string;
  } | null;
}

export function BlogPostEditor({ post, mode }: Props) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: post?.title || "",
    description: post?.description || "",
    content: post?.content || "",
    tags: post?.tags?.join(", ") || "",
    date: post?.date || new Date().toISOString().split('T')[0],
    project: post?.project ? {
      name: post.project.name,
      github: post.project.github || "",
      live: post.project.live || ""
    } : null
  });

  const [showProject, setShowProject] = useState(!!post?.project);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const tags = formData.tags.split(",").map(tag => tag.trim()).filter(Boolean);
      const date = formData.date;
      const slug = post?.slug || generateSlug(formData.title, date);

      // Generate frontmatter and combine with content
      const frontmatter = generateFrontmatter({
        title: formData.title,
        date,
        description: formData.description,
        tags,
        project: formData.project
      });

      const fullContent = `${frontmatter}${formData.content}`;

      const response = await fetch(`/api/admin/blog/posts${mode === 'edit' ? `/${encodeURIComponent(post?.slug || '')}` : ''}`, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          content: fullContent,
          tags,
          date,
          slug
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

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
            {mode === "create" ? "New Post" : "Edit Post"}
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="nextjs, react, typescript"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium">Project Details</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowProject(!showProject);
                  if (!showProject) {
                    setFormData({
                      ...formData,
                      project: { name: "", github: "", live: "" }
                    });
                  } else {
                    setFormData({ ...formData, project: null });
                  }
                }}
              >
                {showProject ? "Remove Project" : "Add Project"}
              </Button>
            </div>

            {showProject && (
              <div className="space-y-4 pl-4 border-l-2 border-slate-800">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <Input
                    value={formData.project?.name || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      project: { ...formData.project!, name: e.target.value }
                    })}
                    required={showProject}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">GitHub URL</label>
                  <Input
                    value={formData.project?.github || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      project: { ...formData.project!, github: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Live Demo URL</label>
                  <Input
                    value={formData.project?.live || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      project: { ...formData.project!, live: e.target.value }
                    })}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              className="font-mono"
              rows={20}
            />
          </div>
        </div>
      </form>
    </div>
  );
} 