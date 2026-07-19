import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.email === 'admin@meridian.com' && body.password === 'Meridian@2026') {
      return NextResponse.json({
        data: {
          user: {
            id: 'u-1234',
            email: 'admin@meridian.com',
            firstName: 'System',
            lastName: 'Admin',
            role: 'Administrator'
          },
          tokens: {
            accessToken: 'mock-jwt-token-xyz'
          }
        }
      });
    }
    
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
