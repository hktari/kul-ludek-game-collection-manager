import WebsiteInspector from "./websiteInspector";

describe("websiteInspector", () => {
  describe("performQueries", () => {
    let websiteInspector: WebsiteInspector;

    beforeEach(() => {
      websiteInspector = new WebsiteInspector();
    });

    afterEach(() => {
      return websiteInspector.close();
    });

    it("should return object with expected properties for valid url and selector", async () => {
      const validUrl = new URL(
        "https://boardgamegeek.com/boardgame/4324/risk-lord-rings"
      );
      const selectors = {
        title: `div.game-header-title:nth-child(2) > div:nth-child(2) > h1:nth-child(1) > a:nth-child(1)`,
        description: `.game-description-body > div:nth-child(1)`,
        minMaxPlayers: `html.ng-scope.fontawesome-i2svg-active.fontawesome-i2svg-complete body.domain-boardgame.ng-scope.pace-done div.d-flex.flex-column.min-vh-100 main#mainbody.global-body.flex-grow-1 div.global-body-content-container.container-fluid div.global-body-content.pending.ready div.content.ng-isolate-scope div ng-include.ng-scope div.game.ng-scope ng-include.ng-scope div.game-primary.ng-scope div.game-header div.game-header-body div.game-header-gameplay.hidden-game-header-collapsed.ng-scope gameplay-module.ng-isolate-scope div.panel.panel-bottom.ng-scope div.panel-body ul.gameplay li.gameplay-item div.gameplay-item-primary span.ng-scope.ng-isolate-scope`,
        gameLength: `li.gameplay-item:nth-child(2) > div:nth-child(1) > span:nth-child(1)`,
      };

      const [result, err] = await websiteInspector.performQueries(validUrl, selectors);
      expect(result.description).toMatch(/A Lord-of-the-Rings-themed version of Risk/)
      expect(result.title).toMatch(/Risk: The Lord of the Rings/)
      expect(result.minMaxPlayers).toBe('2–4')
      expect(result.gameLength).toBe('120 Min')
    }, 10000);

    it("should handle 5 simultaneous calls successfully", async () => {
      const queryRequests: [
        string,
        Record<string, string>,
        Record<string, string>
      ][] = [
          [
            "https://boardgamegeek.com/boardgame/4324/risk-lord-rings",
            {
              title: `div.game-header-title:nth-child(2) > div:nth-child(2) > h1:nth-child(1) > a:nth-child(1)`,
            },
            {
              title: "Risk: The Lord of the Rings",
            },
          ],
          [
            "https://boardgamegeek.com/boardgame/374173",
            {
              title: `div.game-header-title:nth-child(2) > div:nth-child(2) > h1:nth-child(1) > a:nth-child(1)`,
            },
            {
              title: "Star Wars: The Deckbuilding Game",
            },
          ],
          [
            "https://boardgamegeek.com/boardgame/381247",
            {
              title: `div.game-header-title:nth-child(2) > div:nth-child(2) > h1:nth-child(1) > a:nth-child(1)`,
            },
            {
              title: "Dragon Eclipse",
            },
          ],
        ];

      const results = await Promise.allSettled(
        queryRequests.map((queryReq) => {
          const [url, selectors, expectedResult] = queryReq;

          return websiteInspector.performQueries(new URL(url), selectors);
        })
      );

      results.forEach((promisedResult, idx) => {
        const [_, __, expectedResult] = queryRequests[idx];
        const result =
          promisedResult.status === "fulfilled"
            ? promisedResult.value
            : promisedResult.reason;
        expect(result).toMatchObject(expectedResult);
      });
    }, 15000);
  });
});
