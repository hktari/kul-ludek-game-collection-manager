import * as puppeteer from "puppeteer";

export default class WebsiteInspector {
  constructor(public url: URL) {}

  async querySelectorAllInnerText(selector: string) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const [page] = await browser.pages();

      await page.goto(this.url.toString(), { waitUntil: "networkidle0" });

      const data = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            "div.game-header-title:nth-child(2) > div:nth-child(2) > h1:nth-child(1) > a:nth-child(1)"
          )
        ).map((elem) => elem.textContent)
      );

      await browser.close();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
