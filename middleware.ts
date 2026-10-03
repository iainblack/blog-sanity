import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to handle mock data mode
 *
 * Usage:
 *   - Add ?mock=true to any URL to enable mock data
 *   - The cookie is set so subsequent requests don't need the param
 *   - To disable mock mode: visit any page with ?mock=false
 */
export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mockParam = searchParams.get("mock");

  if (mockParam === "true") {
    // Enable mock data
    const response = NextResponse.next();
    response.cookies.set("mock_data", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
    return response;
  }

  if (mockParam === "false") {
    // Disable mock data
    const response = NextResponse.next();
    response.cookies.delete("mock_data");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (except our own)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/).*)",
  ],
};
