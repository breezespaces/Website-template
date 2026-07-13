import { NextRequest, NextResponse } from "next/server";
import { COOKIE_KEYS } from "./api/cookie";

const exactPublicRoutes = ["/", "/about"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN);
  const { pathname } = request.nextUrl;
  
  const isAuthPage = pathname.startsWith('/auth');
  
  const isPublicRoute = 
    exactPublicRoutes.includes(pathname) || pathname.startsWith('/shop/');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
