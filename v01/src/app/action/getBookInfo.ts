import { prisma } from "@/common/prisma";
import { NewBookItem } from "@/common/PuppetCrawler";

export const getBookInfo = async (
  newBookItem: NewBookItem,
  idx: number,
  crawlerId: string,
) => {
  if (!newBookItem.title) return;

  const newBook = await prisma.newBook.findFirst({
    where: {
      name: newBookItem.title
    }
  })

  if (newBook) return;

  await prisma.newBook.create({
    data: {
        sequence: idx,
        name: newBookItem.title,
        url: newBookItem.url,
        price: newBookItem.price,
        author: newBookItem.author,
        mainAuthor: newBookItem.mainAuthor,
        publisher: newBookItem.publisher,
        pubDate: newBookItem.pubDate,
        description: newBookItem.description,
        crawlId: crawlerId,
      }
  })
}