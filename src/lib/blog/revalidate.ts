import { revalidatePath } from 'next/cache';

export async function revalidateBlogPaths(slug?: string) {
  // Always revalidate the main blog page
  revalidatePath('/blog');

  if (slug) {
    // Split the slug to get year and month
    const [year, month] = slug.split('/');
    
    // Revalidate the specific post page
    revalidatePath(`/blog/post/${slug}`);
    
    // Revalidate the archive page for this post's year/month
    revalidatePath(`/blog/archive/${year}/${month}`);
  }
} 