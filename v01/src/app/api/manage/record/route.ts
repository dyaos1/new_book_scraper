// import { NextRequest } from "next/server";

import { prisma } from "@/common/prisma";
import { NextResponse } from "next/server";

export async function GET(
  // request: NextRequest
) {
  const crawlRecord = await prisma.crawl.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: {
          NewBook: true
        }
      }
    }
  })

  return NextResponse.json({
    data: crawlRecord,
    status: 200,
  })
}