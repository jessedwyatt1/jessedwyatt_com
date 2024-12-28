// src/app/api/admin/embeddings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated using our custom auth
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.has('auth_token');

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Process the regeneration request
    const { action } = await req.json();

    if (action !== 'regenerate') {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // TODO: Add your embedding regeneration logic here
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing embeddings request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}