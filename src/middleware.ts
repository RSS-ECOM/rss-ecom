import type { NextRequest } from 'next/server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// 1. Specify protected and public routes
// const publicRoutes = ['/'];
const protectedRoutes = ['/login', '/signup'];

// eslint-disable-next-line @typescript-eslint/require-await
export default async function middleware(req: NextRequest): Promise<NextResponse> {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  // const isPublicRoute = publicRoutes.includes(path);

  // 3. Put your logic to check if the user is authenticated here
  const isLogged = !!cookies().get('login')?.value;

  // 4. Redirect to / if the user is authenticated
  if (isProtectedRoute && isLogged) {
    return NextResponse.redirect(new URL('/products', req.nextUrl));
  }

  return NextResponse.next();
}
