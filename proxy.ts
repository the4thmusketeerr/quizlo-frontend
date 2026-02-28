import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy middleware to protect routes from unauthorized access
 * Runs before every route in the application
 * Note: Next.js uses "proxy.ts" as the new convention (replacing "middleware.ts")
 */
export function proxy(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies or try to get it from localStorage via request headers
  // Note: In Next.js middleware, we can't access localStorage directly
  // We'll use a cookie-based approach for server-side auth checking
  const token = request.cookies.get("auth_token")?.value;

  // If no token is found, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Add a redirect parameter to send user back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, allow the request to proceed
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 * This matcher ensures middleware runs on all routes except:
 * - API routes
 * - Static files (_next/static)
 * - Image optimization files (_next/image)
 * - Favicon and other public files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
