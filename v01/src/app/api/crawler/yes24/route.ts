import { randomSleep } from "@/common/lib/timeSleep";
import { prisma } from "@/common/prisma";
import { NewBookItem, PuppetCrawler } from "@/common/PuppetCrawler"
import { PuppeteerLock } from "@/common/puppeteerLock";
import { NextResponse } from "next/server";

export async function GET() {
  const encoder = new TextEncoder()
  const baseUrl = 'https://www.yes24.com/product/category/newproduct?categoryNumber=001001003';

  // 퍼페티어 점유시 머치러.
  const puppeteerLock = PuppeteerLock.getInstance();
  if (puppeteerLock.status) {
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode("data: 현재 다른 작업자가 크롤러 사용 중. 크롤링을 중단합니다.\n\n"));
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

  const crawler = await prisma.crawl.create({
    data: {
      targetSite: 'Yes24',
      auto: true,
    }
  })

  const crawlerId = crawler.id;
  const newBookData: NewBookItem[] = [];

  const stream = new ReadableStream({
    async start(controller) {
      const puppetCrawler = new PuppetCrawler(baseUrl)
      puppeteerLock.acquire()
      try {
        // 사이트 접속
        try {
          await puppetCrawler.connect();
          controller.enqueue(encoder.encode("data: 사이트 접속 성공\n\n"));
        } catch(e) {
          controller.enqueue(encoder.encode("data: 사이트 접속 실패\n\n"));
          throw e;
        }
        await randomSleep(3000);

        // get count
        let totalItemsCount = 0;
        try {
          totalItemsCount = await puppetCrawler.getItemsTotalCount();
          controller.enqueue(encoder.encode(`data: 데이터 식별 ${totalItemsCount}개\n\n`));
        } catch(e) {
          controller.enqueue(encoder.encode("data: 데이터 식별 중 오류 발생\n\n"));
          throw e;
        }

        console.log('total data: ', totalItemsCount);
        await randomSleep(3000);

        // get data
        try {
          await puppetCrawler.goToFirstPage();
          await randomSleep(3000);
          let isLastPage = false;
          let processedItem = 0;
          while(!isLastPage) {
            const itemsCount = await puppetCrawler.getItemsCountOfCurrentPage();
            for(let i = 1; i <= itemsCount; i++) {
              const newBookItem: NewBookItem = await puppetCrawler.getData(i);
              newBookData.push(newBookItem);

              processedItem++;
              controller.enqueue(encoder.encode(`data: 책 정보 읽는 중(${processedItem}/${totalItemsCount})\n\n`));
              await randomSleep(100);
            }

            await puppetCrawler.goNextPage();
            isLastPage = await puppetCrawler.isLastPage();
          }

        } catch(e) {
          throw e;
        }

        try {
          console.log('prisma 데이터 저장 시작')
          controller.enqueue(encoder.encode(`data: 데이터 영속화 시작\n\n`));
          await prisma.newBook.createMany({
            data: newBookData.map((value, idx) => {
              return {
                sequence: idx,
                name: value.title,
                url: value.url,
                price: value.price,
                author: value.author,
                mainAuthor: value.mainAuthor,
                publisher: value.publisher,
                pubDate: value.pubDate,
                description: value.description,
                crawlId: crawlerId,
              }
            })
          })
          await prisma.crawl.update({
            where: {
              id: crawlerId,
            },
            data: {
              finished: true,
            }
          })
          controller.enqueue(encoder.encode(`data: 데이터 영속화 완료\n\n`));
        } catch(e) {
          controller.enqueue(encoder.encode(`data: 데이터 영속화 실패\n\n`));
          throw e;
        }

        controller.enqueue(encoder.encode(`data: {%FINISHED%}\n\n`));
      } catch(e) {
        console.error(e)
      } finally {
        puppeteerLock.release();
        puppetCrawler.close();
        controller.close();
      }
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
