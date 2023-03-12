import WebsiteInspector from "./websiteInspector";

describe("websiteInspector", () => {
  describe("querySelectorAll", () => {
    it("should return element list for valid url and selector", async () => {
      const validUrl = new URL(
        "https://boardgamegeek.com/boardgame/4324/risk-lord-rings"
      );
      const titleSelector = `div.game-header-title:nth-child(2) > div:nth-child(2) > h1:nth-child(1) > a:nth-child(1)`;
      const websiteInspector = new WebsiteInspector(validUrl);

      const titleElement = await websiteInspector.querySelectorAll(
        titleSelector
      );

      expect(titleElement).toBeDefined();
    });
  });
});
