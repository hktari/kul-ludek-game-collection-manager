import * as puppeteer from "puppeteer";

/**
 * Represents the CSS selector for a object property with given name.
 * Key is property name
 * Value is CSS selector
 */
export type PropertyCSSSelector = {
  [key: string]: string;
};

/**
 * The result of selecting data from a website.
 * Key is given property name
 * Value is the text content of the DOM Element selected or undefined if none was found
 */
export type SelectedWebData = Record<string, string | undefined>;

export type SelectionErrors = Record<string, string>;

export type QueryResult = [SelectedWebData, SelectionErrors];
/**
 * Uses browser automation to open up a website and perform data queries with css
 */
export default class WebsiteInspector {
  private browser?: puppeteer.Browser;

  constructor() {}

  private _mapToObjectOrUndefined(map: Map<any, any>) {
    return map.size === 0 ? undefined : Object.fromEntries(map);
  }
  /**
   *
   * @param url the website URL
   * @param selectors the selectors with which to extract data into the resulting object
   * @returns The data selected from the given website and mapped to object properties
   */
  async performQueries(
    url: URL,
    ...selectors: PropertyCSSSelector[]
  ): Promise<QueryResult> {
    try {
      if (!this.browser) {
        this.browser = await puppeteer.launch({ headless: true });
      }

      const page = await this.browser.newPage();

      await page.goto(url.toString(), { waitUntil: "networkidle0" });

      const selectedData = new Map();

      const errors = new Map();

      for (const textSelector of selectors) {
        for (const [key, selector] of Object.entries(textSelector)) {
          try {
            // todo: returns an array
            let elementText = await page.$eval(
              selector,
              (elem) => (elem as HTMLElement).innerText
            );
            elementText = elementText.trim();

            selectedData.set(key, elementText);
          } catch (error: any) {
            // handle selection errors
            console.error(
              `Failed to get element innerText. Selector: ${selector}`,
              error
            );
            selectedData.set(key, undefined);
            errors.set(key, error.message);
          }
        }
      }

      return [
        Object.fromEntries(selectedData),
        this._mapToObjectOrUndefined(errors),
      ];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  close() {
    if (this.browser) {
      return this.browser.close();
    }
    return Promise.resolve();
  }
}
