import http from "http";
import { getContentAtUrl } from "./dom.util";
import Game from "../models/game";
import { Parser } from "htmlparser2";
import { DomHandler } from "htmlparser2";
import { DomUtils } from "htmlparser2";
import WebsiteInspector, {
  PropertyCSSSelector,
  SelectedWebData,
} from "./websiteInspector";
import { parseMinMaxPlayers } from "./boardGameGeekReader.util";
import { off } from "process";
import { timingSafeEqual } from "crypto";

const CSSselect = require("css-select");

export type BoardGameGeekResource = Partial<Game> & {
  timestamp: string;
};

export default class BoardGameGeekReader {
  private websiteInspector: WebsiteInspector;

  constructor(public baseUrl: string) {
    this.websiteInspector = new WebsiteInspector();
  }

  private _getSelectorsForGame(): PropertyCSSSelector[] {
    // todo: read from config file
    return [
      {
        title:
          "div.game-header-title:nth-child(2) > div:nth-child(2) > h1:nth-child(1) > a:nth-child(1)",
      },
      { description: ".game-description-body > div:nth-child(1)" },
      {
        minAge:
          "li.gameplay-item:nth-child(3) > div:nth-child(1) > span:nth-child(1)",
      },
      //{ maxAge:             },
      {
        minMaxPlayers:
          "li.gameplay-item:nth-child(1) > div:nth-child(1) > span:nth-child(1)",
      },
      {
        categories:
          "li.feature:nth-child(2) > div:nth-child(3) > popup-list:nth-child(1) > span > a",
      },
      {
        minMaxPlaytime:
          "li.gameplay-item:nth-child(2) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)",
      },
      //v developer:            string},
      {
        publisher:
          "div.game-header-credits:nth-child(3) > ng-include:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(3) > popup-list:nth-child(2) > span:nth-child(2) > a:nth-child(1)",
      },
      { releaseDateYear: ".game-year" },
      //{ errors?:             strin}g
    ];
  }

  private _parseDataIntoGame(websiteData: SelectedWebData) {
    let minPlayers, maxPlayers;
    if (websiteData.minMaxPlayers) {
      [minPlayers, maxPlayers] = parseMinMaxPlayers(websiteData.minMaxPlayers);
    }

    let minAge;
    if (websiteData.minAge) {
      minAge = +websiteData.minAge;
    }

    const game: Partial<BoardGameGeekResource> = {
      title: websiteData.title,
      description: websiteData.description,
      minAge,
      minPlayers,
      maxPlayers,
      genre: websiteData.categories,
      publisher: websiteData.publisher,
      releaseDateYear: websiteData.releaseDateYear,
    };

    return game;
  }

  getResourceForGameId(gameId: string) {
    return new Promise<BoardGameGeekResource>(async (resolve, reject) => {
      const resourceUri = `/boardgame/${gameId}`;
      const gameUrl = new URL(resourceUri, this.baseUrl);

      const [websiteData, errors] = await this.websiteInspector.performQueries(
        gameUrl,
        ...this._getSelectorsForGame()
      );

      const gameResource: BoardGameGeekResource = {
        boardGameGeekId: gameId,
        timestamp: new Date().toISOString(),
        errors:
          errors &&
          Object.entries(errors)
            .map((attr, err) => `${[attr]}: ${err}`)
            .join("\n"),
        ...this._parseDataIntoGame(websiteData),
      };

      this.websiteInspector.close();

      return resolve(gameResource);
    });
  }
}
