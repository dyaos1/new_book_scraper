import { PuppeteerLock } from "@/common/puppeteerLock";
import { NextResponse } from "next/server";

export async function GET() {
  const puppeteerLock = PuppeteerLock.getInstance()
  const isOccupied = puppeteerLock.status;
  return NextResponse.json(isOccupied)
}