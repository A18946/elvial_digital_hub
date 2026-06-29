import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Ignore static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // ✅ αν ήδη έχει γλώσσα
  if (pathname.startsWith("/en") || pathname.startsWith("/el")) {
    return;
  }

  // ✅ default γλώσσα
  const lang = "en";

  return NextResponse.redirect(
    new URL(`/${lang}${pathname}`, request.url)
  );
}