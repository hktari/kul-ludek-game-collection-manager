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
      const expectedResult = {
        title: "Risk: The Lord of the Rings",
        description: `A Lord-of-the-Rings-themed version of Risk, with the following differences:
  
  The map is of Middle Earth, and the tokens represent armies of that fictional world.
  (Note that in this "Two Towers edition", the first version of the game, the map is incomplete, unless you own the expansion. For the newer version with complete map, see the reimplementation of this, the "trilogy edition".)
  
  You play either good or evil.
  
  Leaders, missions and sites of power have been added.
  
  The One Ring acts as a timing mechanism, when it leaves the board, the game ends.
  
  Components for this "Two Towers edition":
  ("trilogy edition" has 90 per army)
  
  40 Elven Archers/Orcs
  12 Riders of Rohan/Dark Riders
  6 Eagles/Cave Trolls
  2 shields per color
  
  Gameboard
  4 Complete armies in different colors: (60 per color)
  42 Territory Cards (9 Good, 9 Evil, 24 Neutral)
  2 Wild Cards
  40 Adventure Cards
  The One Ring
  3 Red Dice
  2 Black Dice`,
        minMaxPlayers: `2–4`,
        gameLength: `120 Min`,
      };

      const result = await websiteInspector.performQueries(validUrl, selectors);
      expect(result).toMatchObject(expectedResult);
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
