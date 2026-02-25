import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/api/auth'];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return true;
  }

  if (pathname.includes('.') && !pathname.endsWith('.')) {
    return true;
  }

  return pathname.startsWith('/_next') || pathname === '/favicon.ico';
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const signInUrl = new URL('/sign-in', req.url);
  signInUrl.searchParams.set('callbackUrl', pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ['/(.*)'],
};
