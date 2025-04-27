export class PuppeteerLock {
  private static instance: PuppeteerLock;
  private isLocked: boolean = false;

  private constructor() {} // 외부에서 new 못하게 막음

  public static getInstance(): PuppeteerLock {
    if (!PuppeteerLock.instance) {
      console.log('created new instance!')
      PuppeteerLock.instance = new PuppeteerLock();
    }
    return PuppeteerLock.instance;
  }

  public acquire(): boolean {
    if (this.isLocked) return false;
    this.isLocked = true;
    return true;
  }

  public release() {
    this.isLocked = false;
  }

  public get status() {
    return this.isLocked;
  }
}
