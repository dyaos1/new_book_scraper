import { prisma } from "@/common/prisma";
import { PuppeteerLock } from "@/common/puppeteerLock";
import { NextResponse } from "next/server";

export async function GET() {
  const puppeteerLock = PuppeteerLock.getInstance()
  const lock = puppeteerLock.acquire()
  console.log(lock);
  return NextResponse.json(lock)
}