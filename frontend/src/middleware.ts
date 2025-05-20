import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/admin/login' || path.startsWith('/_next') || path.includes('.');
  const authToken = request.cookies.get('authToken')?.value;

  // If it's a public path and user is already logged in, redirect to dashboard
  if (isPublicPath && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If it's a protected path and user is not logged in, redirect to login
  if (!isPublicPath && !authToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

// Specify the paths the middleware will run on
export const config = {
  matcher: [
    '/dashboard/:path*',  // All dashboard routes
    '/admin/login'        // Login page
  ],
};
