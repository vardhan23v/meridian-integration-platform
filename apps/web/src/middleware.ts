import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // Note: Since Zustand persist uses localStorage, we can't read it easily in Edge middleware.
  // In a real prod environment we would use an HttpOnly cookie for the token.
  // For this scaffold, we'll let client-side routing handle the protection,
  // or check a cookie if one exists.

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
