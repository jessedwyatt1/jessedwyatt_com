"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Markdown } from "@/components/markdown";
import { 
  AlertCircle, Save, X, Upload, 
  Hash, List, Quote, Code, 
  AlertTriangle, Lightbulb, Eye, PenTool
} from "lucide-react";
import { BlogPost } from "@/lib/blog/types";
import { generateFrontmatter, generateSlug, parseUploadedFile } from "@/lib/blog/client-utils";


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

function insertAtCursor(textarea: HTMLTextAreaElement, before: string) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  
  // Get the line start and end positions
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = text.indexOf('\n', end);
  const currentLine = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);
  
  // Remove existing markdown if present
  const cleanLine = currentLine.replace(/^[#\-\s>]+\s*/, '');
  const newLine = `${before}${cleanLine}`;
  
  textarea.focus(); // Ensure textarea is focused
  textarea.setRangeText(
    newLine,
    lineStart,
    lineEnd === -1 ? text.length : lineEnd,
    'end'
  );
  
  // Trigger onChange event
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
}

function insertBlock(textarea: HTMLTextAreaElement, before: string, after: string) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.slice(start, end);
  
  textarea.focus(); // Ensure textarea is focused
  textarea.setRangeText(
    `${before}${selectedText}${after}`,
    start,
    end,
    'end'
  );
  
  // Trigger onChange event
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
}

export function BlogPostEditor({ post, mode }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProject, setShowProject] = useState(!!post?.project);
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
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (mode === 'create' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      if (params.get('source') === 'upload') {
        // Get data from localStorage
        const pendingPost = localStorage.getItem('pendingBlogPost');
        if (pendingPost) {
          try {
            const data = JSON.parse(pendingPost);
            setFormData(data);
            if (data.project) {
              setShowProject(true);
            }
            // Clear the stored data
            localStorage.removeItem('pendingBlogPost');
          } catch (error) {
            console.error('Error parsing stored blog post:', error);
          }
        }
      } else if (params.has('title') || params.has('content')) {
        // Handle normal URL parameters as before
        setFormData({
          title: params.get('title') || '',
          description: params.get('description') || '',
          content: params.get('content') || '',
          tags: params.get('tags') || '',
          date: params.get('date') || new Date().toISOString().split('T')[0],
          project: params.get('project') ? JSON.parse(params.get('project')!) : null
        });

        if (params.get('project')) {
          setShowProject(true);
        }
      }
    }
  }, [mode]);

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

      // Format the URL properly for the API by splitting the slug into parts
      const apiUrl = mode === 'edit' 
        ? `/api/admin/blog/posts/${slug.split('/').join('/')}`
        : '/api/admin/blog/posts';

      const response = await fetch(apiUrl, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          content: fullContent,
          tags,
          date,
          slug,
          project: formData.project
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save post');
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkdownAction = (action: string) => {
    if (!textareaRef.current) return;
    
    switch (action) {
      case 'h1':
        insertAtCursor(textareaRef.current, '# ');
        break;
      case 'h2':
        insertAtCursor(textareaRef.current, '## ');
        break;
      case 'h3':
        insertAtCursor(textareaRef.current, '### ');
        break;
      case 'h4':
        insertAtCursor(textareaRef.current, '#### ');
        break;
      case 'h5':
        insertAtCursor(textareaRef.current, '##### ');
        break;
      case 'list':
        insertAtCursor(textareaRef.current, '- ');
        break;
      case 'quote':
        insertAtCursor(textareaRef.current, '> ');
        break;
      case 'code':
        insertBlock(textareaRef.current, '```\n', '\n```');
        break;
      case 'note':
        insertBlock(textareaRef.current, ':::note\n', '\n:::');
        break;
      case 'warning':
        insertBlock(textareaRef.current, ':::warning\n', '\n:::');
        break;
      case 'tip':
        insertBlock(textareaRef.current, ':::tip\n', '\n:::');
        break;
    }
    textareaRef.current.focus();
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
    <div className="container max-w-[90rem] py-8">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {mode === "create" ? "New Post" : "Edit Post"}
          </h1>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".md,.txt"
              className="hidden"
              id="file-upload"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const { frontmatter, content } = await parseUploadedFile(file);
                  setFormData({
                    title: frontmatter.title || "",
                    description: frontmatter.description || "",
                    content: content,
                    tags: Array.isArray(frontmatter.tags) 
                      ? frontmatter.tags.join(", ")
                      : frontmatter.tags || "",
                    date: frontmatter.date || new Date().toISOString().split('T')[0],
                    project: frontmatter.project ? {
                      name: frontmatter.project.name || "",
                      github: frontmatter.project.github || "",
                      live: frontmatter.project.live || ""
                    } : null
                  });
                  if (frontmatter.project) {
                    setShowProject(true);
                  }
                } catch (error) {
                  console.error('Error processing file:', error);
                  setError('Failed to process uploaded file');
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Markdown
            </Button>
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
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-80 space-y-4">
            <div className="sticky top-8">
              <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
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
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {/* Preview Toggle */}
            <div className="flex justify-between items-center mb-4">
              <Toggle
                pressed={isPreview}
                onPressedChange={setIsPreview}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isPreview ? (
                  <>
                    <PenTool className="w-4 h-4" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Preview
                  </>
                )}
              </Toggle>
            </div>

            <div className="flex gap-4">
              {/* Content Area */}
              <div className="flex-1">
                {isPreview ? (
                  <div className="prose prose-invert max-w-none p-4 bg-slate-900/30 rounded-lg border border-slate-800 min-h-[calc(100vh-16rem)]">
                    <Markdown content={formData.content} />
                  </div>
                ) : (
                  <Textarea
                    ref={textareaRef}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    className="font-mono h-[calc(100vh-16rem)] resize-none"
                    placeholder="Write your post content here..."
                  />
                )}
              </div>

              {/* Markdown Toolbar - now on the right */}
              {!isPreview && (
                <div className="w-10 space-y-2">
                  <div className="sticky top-8 space-y-2 p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('h1')}
                      title="Heading 1"
                      className="w-full px-0"
                    >
                      <Hash className="w-4 h-4" />1
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('h2')}
                      title="Heading 2"
                      className="w-full px-0"
                    >
                      <Hash className="w-4 h-4" />2
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('h3')}
                      title="Heading 3"
                      className="w-full px-0"
                    >
                      <Hash className="w-4 h-4" />3
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('h4')}
                      title="Heading 4"
                      className="w-full px-0"
                    >
                      <Hash className="w-4 h-4" />4
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('h5')}
                      title="Heading 5"
                      className="w-full px-0"
                    >
                      <Hash className="w-4 h-4" />5
                    </Button>
                    <div className="w-full h-px bg-slate-800 my-2" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('list')}
                      title="List Item"
                      className="w-full px-0"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('quote')}
                      title="Blockquote"
                      className="w-full px-0"
                    >
                      <Quote className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('code')}
                      title="Code Block"
                      className="w-full px-0"
                    >
                      <Code className="w-4 h-4" />
                    </Button>
                    <div className="w-full h-px bg-slate-800 my-2" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('note')}
                      title="Note"
                      className="w-full px-0"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('warning')}
                      title="Warning"
                      className="w-full px-0"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkdownAction('tip')}
                      title="Tip"
                      className="w-full px-0"
                    >
                      <Lightbulb className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 