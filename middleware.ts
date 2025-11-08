// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only these routes require login
const PROTECTED = [/^\/accounts/, /^\/categories/, /^\/transactions/]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // skip non-protected routes
  const isProtected = PROTECTED.some((re) => re.test(pathname))
  if (!isProtected) return NextResponse.next()

  // Supabase SSR writes these cookies when logged in
  const access = req.cookies.get('sb-access-token')?.value
  const refresh = req.cookies.get('sb-refresh-token')?.value
  if (access && refresh) {
    return NextResponse.next()
  }

  // not logged in → redirect to /login with ?redirect=<original>
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('redirect', pathname)
  return NextResponse.redirect(url)
}

// Tell Next which paths run through the middleware
export const config = {
  matcher: ['/accounts/:path*', '/categories/:path*', '/transactions/:path*'],
}
