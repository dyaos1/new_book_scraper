import puppeteer, { Browser, Page } from "puppeteer";

export class PuppetCrawler {
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor(private baseUrl: string) {}

  async connect() {
    this.browser = await puppeteer.launch({headless: true});
    this.page = await this.browser.newPage();
    await this.page.goto(this.baseUrl);
  }

  async waitUntilEqual(selector: string, value: string): Promise<void> {
    await this.page?.waitForFunction(({selector, value}) => {
      const textContent = document.querySelector(selector)?.textContent;
      return textContent === value;
    }, {timeout: 10000}, {selector, value})
  }

  async waitUntilDifferent(selector: string, value: string): Promise<void> {
    await this.page?.waitForFunction(({selector, value}) => {
      const textContent = document.querySelector(selector)?.textContent;

      console.log(`textContent / value : ${textContent} / ${value}`);

      return textContent !== value;
    }, {timeout: 10000}, {selector, value})
  }

  async getItemsTotalCount(): Promise<number> {
    const paginatorSelector = '#newProductContentsWrap > div.newGoodsPagen > div > div > div';
    const paginatorElement = this.page?.$(paginatorSelector)

    let pageCount = 0;
    let itemCount = 0;

    // 여러 페이지 일 경우
    if (paginatorElement) {
      const endPageSelector = '#newProductContentsWrap > div.newGoodsPagen > div > div > div > a.bgYUI.end';
      const endPageElement = await this.page?.$(endPageSelector);
      
      // 10페이지 미만일 경우
      if (!endPageElement) {
        console.log("10페이지 미만")
        const pageListSelector = '#newProductContentsWrap > div.newGoodsPagen > div > div > div > a'
        pageCount = await this.page?.$$eval(pageListSelector, items => items.length + 1) || 0
        
        const lastPageSelector = `#newProductContentsWrap > div.newGoodsPagen > div > div > div > a:nth-child(${pageCount.toString()})`
        await this.page?.click(lastPageSelector)

        const currentPageCursorSelector = '#newProductContentsWrap > div.newGoodsPagen > div > div > div > strong';
        await this.waitUntilDifferent(currentPageCursorSelector, "1");

      // 10페이지 이상일 경우
      } else {
        console.log("10페이지 이상")
        await this.page?.click(endPageSelector);

        const currentPageCursorSelector = '#newProductContentsWrap > div.newGoodsPagen > div > div > div > strong';
        await this.waitUntilDifferent(currentPageCursorSelector, "1");

        const currentPageCursorElement = await this.page?.$(currentPageCursorSelector);
        pageCount = await currentPageCursorElement?.evaluate(el => Number.parseInt(el.innerText.trim())) || 0;
      }
    }

    // 1페이지 일 경우: do nothing

    itemCount = await this.getItemsCountOfCurrentPage();

    return itemCount + (24 * pageCount);
  }

  async goToFirstPage() {
    await this.page?.goto(this.baseUrl);
    const currentPageCursorSelector = '#newProductContentsWrap > div.newGoodsPagen > div > div > div > strong';
    await this.waitUntilEqual(currentPageCursorSelector, "1");
  }

  async isLastPage(): Promise<boolean> {
    const itemsCount = await this.getItemsCountOfCurrentPage()
    if (itemsCount < 24) return true;

    const currentCursor = await this.getCurrentPage();
    const nextCursor = currentCursor + 1;

    let nextPageExist = false;

    const paginatorSelector = `#newProductContentsWrap > div.newGoodsPagen > div > div > div > a`;
    const paginatorElements = await this.page?.$$(paginatorSelector);
    if (!paginatorElements) throw new Error("Failed to identify pagination units");
    for (const paginatorElement of paginatorElements) {
      const num = await paginatorElement.evaluate(el => el.innerText);
      if (nextCursor === Number.parseInt(num || "-1")) {
        nextPageExist = true;
        break;
      }
    }

    const nextButtonSelector = '#newProductContentsWrap > div.newGoodsPagen > div > div > div > a.bgYUI.next';
    const nextButtonElement = await this.page?.$(nextButtonSelector);

    if (!nextPageExist && !nextButtonElement) return true;

    return false;
  }

  async goNextPage() {
    const currentCursor = await this.getCurrentPage();
    const nextCursor = currentCursor + 1;

    console.log('<go next page>')
    console.log('current page: ', currentCursor)
    console.log('next page: ', nextCursor)
    console.log('</go next page>')

    if (currentCursor % 10 === 0) {
      const nextButtonSelector = '#newProductContentsWrap > div.newGoodsPagen > div > div > div > a.bgYUI.next';
      await this.page?.click(nextButtonSelector);
    } else {
      const paginatorSelector = `#newProductContentsWrap > div.newGoodsPagen > div > div > div > a`;
      const paginatorElements = await this.page?.$$(paginatorSelector);
      if (!paginatorElements) throw new Error("Failed to identify pagination units");
      for (const paginatorElement of paginatorElements) {
        const num = await paginatorElement.evaluate(el => el.innerText);
        if (nextCursor === Number.parseInt(num || "-1")) {
          await paginatorElement.click();
          break;
        }
      }
    }

    const currentPageCursorSelector = '#newProductContentsWrap > div.newGoodsPagen > div > div > div > strong';
    await this.waitUntilEqual(currentPageCursorSelector, nextCursor.toString());

    // validator
    const newCurrentCursor = await this.getCurrentPage();
    if (newCurrentCursor !== nextCursor) throw new Error("Error. The page cursor number went wrong.")
  }

  async getCurrentPage(): Promise<number> {
    const currentPageCursorSelector = '#newProductContentsWrap > div.newGoodsPagen > div > div > div > strong';
    const currentPage = await this.page?.$eval(currentPageCursorSelector, el => (Number.parseInt(el.innerText)));
    if (!currentPage) {
      throw new Error("Failed to get current page cursor");
    }
    return currentPage;
  }

  async getItemsCountOfCurrentPage(): Promise<number> {
    const itemListSelector = '#yesNewList > li';
    return await this.page?.$$eval(itemListSelector, items => items.length) || 0;
  }

  async getData(idx: number): Promise<NewBookItem> {
    const itemSelector = `#yesNewList > li:nth-child(${idx.toString()}) > div > div.item_info > div.info_row.info_name > a.gd_name`;
    const itemElement = await this.page?.waitForSelector(itemSelector);
    const itemUrl = await itemElement?.evaluate(el => (el as HTMLAnchorElement).href);

    const titleSelector = `#yesNewList > li:nth-child(${idx.toString()}) > div > div.item_info > div.info_row.info_name > a.gd_name`;
    const titleElement = await this.page?.$(titleSelector);
    const title = await titleElement?.evaluate(el => (el as HTMLElement).innerText);

    const priceSelector = `#yesNewList > li:nth-child(${idx.toString()}) > div > div.item_info > div.info_row.info_price > strong > em`;
    const priceElement = await this.page?.$(priceSelector);
    const price = await priceElement?.evaluate(el => (el as HTMLElement).innerText);

    const authorSelector = `#yesNewList > li:nth-child(${idx.toString()}) > div > div.item_info > div.info_row.info_pubGrp > span.authPub.info_auth`;
    const authorElement = await this.page?.$(authorSelector);
    const author = await authorElement?.evaluate(el => (el as HTMLElement).innerText.replace("정보 더 보기/감추기 ", ""));

    const mainAuthorSelector = `#yesNewList > li:nth-child(${idx.toString()}) > div > div.item_info > div.info_row.info_pubGrp > span.authPub.info_auth > a`;
    const authorCount = await this.page?.$$eval(mainAuthorSelector, el => el.length);
    
    let mainAuthor: string | undefined = undefined;
    if (authorCount && authorCount > 1) {
      mainAuthor = await this.page?.$eval(`#yesNewList > li:nth-child(${idx.toString()}) > div > div.item_info > div.info_row.info_pubGrp > span.authPub.info_auth > a:nth-child(1)`,
      el => el.innerText)
    }

    const publisherSelector = `#yesNewList > li:nth-child(${idx.toString()}) > div > div.item_info > div.info_row.info_pubGrp > span.authPub.info_pub > a`;
    const publisherElement = await this.page?.$(publisherSelector);
    const publisher = await publisherElement?.evaluate(el => (el as HTMLElement).innerText);

    const pubDateSelector = `#yesNewList > li:nth-child(${idx.toString()}) > div > div.item_info > div.info_row.info_pubGrp > span.authPub.info_date`;
    const pubDateElement = await this.page?.$(pubDateSelector); // 이 항목이 없는 경우가 발견됨
    const pubDate = await pubDateElement?.evaluate(el => (el as HTMLElement).innerText);

    const descriptionSelector = `#yesNewList > li:nth-child(${idx.toString()}) > div > div.item_info > div.info_row.info_read`;
    const descriptionElement = await this.page?.$(descriptionSelector);
    const description = await descriptionElement?.evaluate(el => (el as HTMLElement).innerText);

    return {
      title: title,
      url: itemUrl,
      price: price,
      author: author?.replace("정보 더 보기/감추기 ", ""),
      mainAuthor: mainAuthor,
      publisher: publisher,
      pubDate: pubDate,
      description: description,
    }
  }

  async close() {
    this.browser?.close()
  }
}

export interface NewBookItem {
  title?: string
  url?: string
  price?: string
  author?: string
  mainAuthor?: string
  publisher?: string
  pubDate?: string
  description?: string
}