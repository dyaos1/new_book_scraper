import { prisma } from "@/common/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { name, email, password } = await request.json()

  const hashedPassword = await bcrypt.hash(password as string, 12)
  const user = await prisma.user.create({ data: { name, email, hashedPassword } })
  return NextResponse.json({ success: true, user })
}