import { notFound } from "next/navigation";
import { BlogPostEditor } from "@/components/admin/blog-post-editor";
import { getBlogPost } from "@/lib/blog/utils";
import { BlogParams } from "@/lib/blog/types";

interface Props {
  params: BlogParams;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug.join('/'));

  if (!post) {
    notFound();
  }

  return <BlogPostEditor post={post} mode="edit" />;
} 