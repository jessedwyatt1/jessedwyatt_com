import { revalidatePath } from 'next/cache';

export async function revalidateProjectPaths() {
  // Revalidate the main projects page
  revalidatePath('/projects');
  // Revalidate the home page since it shows featured projects
  revalidatePath('/');
} 