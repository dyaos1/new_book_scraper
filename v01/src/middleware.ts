import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.JWT_SECRET})
  
  const pathname = req.nextUrl.pathname
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // if (!session) {
  //   return NextResponse.redirect(new URL("/auth/", req.url))
  // }

  // admin 유저만 접근 가능
  if (pathname.startsWith('/auth/admin') && !session?.isAdmin) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}