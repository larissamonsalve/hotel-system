import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  const matchHotel = pathname.match(/^\/h\/([a-zA-Z0-9-]+)(\/.*)?$/);
  
  if (matchHotel) {
    const tenantSlug = matchHotel[1];
    requestHeaders.set('x-tenant-slug', tenantSlug);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const matchAdmin = pathname.match(/^\/admin\/([a-zA-Z0-9-]+)(\/.*)?$/);

  if (matchAdmin) {
    const tenantSlug = matchAdmin[1];
    requestHeaders.set('x-tenant-slug', tenantSlug);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/h/:path*',
    '/admin/:path*',
    '/api/h/:path*',
    '/api/admin/:path*'
  ],
};