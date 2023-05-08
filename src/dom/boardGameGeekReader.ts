import http from "http";
import { getContentAtUrl } from "./dom.util";
import Game from "../models/game";
import { Parser } from "htmlparser2";
import { DomHandler } from "htmlparser2";
import { DomUtils } from "htmlparser2";
import WebsiteInspector, {
  PropertyCSSSelector,
  SelectedWebData,
  SelectionErrors,
} from "./websiteInspector";
import { parseMinAge, parseMinMaxPlayers } from "./boardGameGeekReader.util";
import merge from "lodash/fp/merge";
import BoardGameGeekReaderParser from "./boardGameGeekReaderParsers";
import BoardGameGeekErrorParser from "./boardGameGeekErrorParser";

export type BoardGameGeekResource = Partial<Game>;

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

  async getResourceForGameId(gameId: string): Promise<BoardGameGeekResource> {
    const resourceUri = `/boardgame/${gameId}`;
    const gameUrl = new URL(resourceUri, this.baseUrl);

    const [websiteData, queryErrors] =
      await this.websiteInspector.performQueries(
        gameUrl,
        ...this._getSelectorsForGame()
      );

    const parser = new BoardGameGeekReaderParser();
    const [partialGameResource, parseErrors] = parser.parse(websiteData);

    const errorParser = new BoardGameGeekErrorParser();
    if (queryErrors) {
      errorParser.add(queryErrors);
    }
    if (parseErrors) {
      errorParser.add(parseErrors);
    }

    const errorsStr = errorParser.parse();

    const gameResource: BoardGameGeekResource = {
      boardGameGeekId: gameId,
      errors: errorsStr,
      ...partialGameResource,
    };

    this.websiteInspector.close();

    return gameResource;
  }
}
