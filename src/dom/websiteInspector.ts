import * as puppeteer from "puppeteer";

type TextSelector = {
  [key: string]: string;
};

export default class WebsiteInspector {
  private browser?: puppeteer.Browser;

  constructor() {}

  async performQueries(
    url: URL,
    ...selectors: TextSelector[]
  ): Promise<Record<string, string | undefined>> {
    try {
      if (!this.browser) {
        this.browser = await puppeteer.launch({ headless: true });
      }

      const page = await this.browser.newPage();

      await page.goto(url.toString(), { waitUntil: "networkidle0" });

      const selectedData = new Map();

      for (const textSelector of selectors) {
        for (const [key, selector] of Object.entries(textSelector)) {
          try {
            let elementText = await page.$eval(
              selector,
              (elem) => (elem as HTMLElement).innerText
            );

            elementText = elementText.trim();

            selectedData.set(key, elementText);
          } catch (error) {
            console.error(
              `Failed to get element innerText. Selector: ${selector}`,
              error
            );
            selectedData.set(key, undefined);
          }
        }
      }

      return Object.fromEntries(selectedData);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  close() {
    if (this.browser) {
      this.browser.close();
    }
  }
}
