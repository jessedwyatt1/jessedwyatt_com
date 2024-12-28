import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('auth_token');

  if (authToken?.value === 'authenticated') {
    return new NextResponse(null, { status: 200 });
  }

  return new NextResponse(null, { status: 401 });
} 