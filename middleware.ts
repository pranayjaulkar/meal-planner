import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  PUBLIC_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
} from "@/lib/auth/constants";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get(
    AUTH_COOKIE_NAME
  )?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname.startsWith(route)
  );

  const isAuthenticated = Boolean(token);

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(
      new URL(
        DEFAULT_LOGIN_REDIRECT,
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};