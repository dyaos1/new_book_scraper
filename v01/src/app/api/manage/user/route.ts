import { prisma } from "@/common/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const offset = Number.parseInt(searchParams.get("offset") || "0")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      isValid: true,
      isAdmin: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip: offset,
    take: 10,
  });

  const count = await prisma.user.count();
  
  return NextResponse.json({
    data: {users, count},
    status: 200,
  })
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const promoteType = searchParams.get("type")

  const { adminPromotors }: { adminPromotors: {[id: string]: boolean} } = await request.json()

  if (promoteType === "ADMIN") {
    const updates = Object.entries(adminPromotors).map(([id, isAdmin]) => {
      return prisma.user.update({
        where: { id }, 
        data: { isAdmin }
      })
    })
    await prisma.$transaction(updates);

    return NextResponse.redirect(new URL('/auth/admin/manage', request.url))
  }
}