import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: check auth cookie
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("admin_session");
    if (pathname === "/admin" && session?.value === "true") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (pathname !== "/admin" && session?.value !== "true") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Skip i18n for API routes and uploads
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads")
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
