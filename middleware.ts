import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to handle mock data mode (development only, see sanity/lib/fetch.ts)
 *
 * Usage:
 *   - ?mock=true                       enable mock data (persisted in a cookie)
 *   - ?mock=true&scenario=empty        pick a data scenario:
 *                                      default | empty | single | ten | eleven | many
 *   - ?mock=false                      disable mock data again
 */
export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mockParam = searchParams.get("mock");
  const scenarioParam = searchParams.get("scenario");

  if (mockParam === "true") {
    const response = NextResponse.next();
    const options = { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" as const };
    response.cookies.set("mock_data", "true", options);
    if (scenarioParam) {
      response.cookies.set("mock_scenario", scenarioParam, options);
    }
    return response;
  }

  if (mockParam === "false") {
    const response = NextResponse.next();
    response.cookies.delete("mock_data");
    response.cookies.delete("mock_scenario");
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
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/).*)",
  ],
};
