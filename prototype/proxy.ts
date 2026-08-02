import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Next.js 16: la convención "middleware" fue renombrada a "proxy".
 * Capa optimista (UX): redirige a /login a quien acceda a /admin sin cookie de
 * sesión. NO es el control de seguridad real — ese vive en cada route handler
 * vía getAdminSession() (ver lib/session.ts).
 */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
