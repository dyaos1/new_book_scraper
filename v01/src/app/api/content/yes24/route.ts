import { prisma } from "@/common/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const offset = Number.parseInt(searchParams.get("offset") || "0")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  const newestCralwer = await prisma.crawl.findFirst({
    where: {
      finished: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      NewBook: {
        orderBy: {
          sequence: 'asc'
        },
        skip: offset,
        take: limit,
      },
      _count: {
        select: {
          NewBook: true,
        },
      },
    },
  })

  if (!newestCralwer) {
    return NextResponse.json({
      data: {},
      status: 404,
    })
  }

  return NextResponse.json({
    data: newestCralwer,
    status: 200,
  })
}