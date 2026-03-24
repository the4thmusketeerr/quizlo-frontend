import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to protect routes from unauthorized access
 * Runs before every route in the application
 */
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  // We use startsWith or exact match depending on the route
  const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies
  // Note: localStorage isn't available server-side
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
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (with extensions)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
