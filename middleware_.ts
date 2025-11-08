import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = [/^\/accounts/, /^\/categories/, /^\/transactions/]

function hasSupabaseSession(req: NextRequest) {
  const names = req.cookies.getAll().map(c => c.name)

  // Accept both classic and project-ref cookie names
  const hasAccess =
    names.includes('sb-access-token') ||
    names.some(n => /^sb-[^-]+-access-token$/.test(n))

  // Some environments don’t set a refresh cookie on every request, that’s OK.
  return hasAccess
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // only guard protected paths
  const isProtected = PROTECTED.some(re => re.test(pathname))
  if (!isProtected) return NextResponse.next()

  // already signed in -> continue
  if (hasSupabaseSession(req)) {
    return NextResponse.next()
  }

  // not signed in -> send to login with ?redirect=<original>
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('redirect', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/accounts/:path*', '/categories/:path*', '/transactions/:path*'],
}
