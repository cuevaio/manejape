import { NextResponse, type NextRequest } from 'next/server';

import {
  SESSION_TOKEN_COOKIE_EXPIRES_IN_S,
  SESSION_TOKEN_COOKIE_NAME,
} from './lib/auth/constants';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.nextUrl.pathname.startsWith('/api/webhook/stripe')) {
    return NextResponse.next();
  }

  if (request.method === 'GET') {
    const response = NextResponse.next();
    const token = request.cookies.get(SESSION_TOKEN_COOKIE_NAME)?.value ?? null;
    if (token !== null) {
      // Only extend cookie expiration on GET requests since we can be sure
      // a new session wasn't set when handling the request.
      response.cookies.set('session', token, {
        path: '/',
        maxAge: SESSION_TOKEN_COOKIE_EXPIRES_IN_S,
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    }
    return response;
  }
  const originHeader = request.headers.get('origin');
  const hostHeader = request.headers.get('x-forwarded-host');

  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return new NextResponse(null, {
      status: 403,
    });
  }
  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}
