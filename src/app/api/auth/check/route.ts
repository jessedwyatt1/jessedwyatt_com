import { NextResponse } from 'next/server';
import { checkServerAuth } from '@/lib/auth-server';

export async function GET() {
  const isAuthenticated = await checkServerAuth();
  
  if (isAuthenticated) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json(
    { authenticated: false },
    { status: 401 }
  );
} 