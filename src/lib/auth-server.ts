import { cookies } from 'next/headers';

export async function checkServerAuth() {
  const cookieStore = await cookies();
  return cookieStore.has('auth_token');
} 