
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('photoPoetToken');
  const { pathname } = request.nextUrl;

  // Allow access to /login and /register pages regardless of authentication status
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return NextResponse.next();
  }

  // If trying to access other pages and not authenticated, redirect to login
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname); // Optional: pass original path
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access /login or /register, redirect to home
  // This is optional, some apps allow viewing login/register even if logged in.
  // if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets like images
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
    