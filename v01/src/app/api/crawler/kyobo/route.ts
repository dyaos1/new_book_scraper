import { fixSleep, randomSleep } from "@/common/lib/timeSleep";
import { PuppeteerLock } from "@/common/puppeteerLock";
import { NextResponse } from "next/server";

export async function GET() {

  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      const puppeteerLock = PuppeteerLock.getInstance()
      puppeteerLock.acquire()
      controller.enqueue(encoder.encode(`data: 현재 교보 데이터 크롤러는 개발중\n\n`))
      await randomSleep(3000)
      controller.enqueue(encoder.encode(`data: 모의 메시지 스트리밍 5초후 종료합니다.\n\n`))
      await fixSleep(1000)
      controller.enqueue(encoder.encode(`data: 5\n\n`))
      await fixSleep(1000)
      controller.enqueue(encoder.encode(`data: 4\n\n`))
      await fixSleep(1000)
      controller.enqueue(encoder.encode(`data: 3\n\n`))
      await fixSleep(1000)
      controller.enqueue(encoder.encode(`data: 2\n\n`))
      await fixSleep(1000)
      controller.enqueue(encoder.encode(`data: 1\n\n`))
      puppeteerLock.release()
      await fixSleep(1000)
      controller.enqueue(encoder.encode(`data: 종료\n\n`))
    }
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}