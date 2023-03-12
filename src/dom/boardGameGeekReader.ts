import http from "http";
import { getContentAtUrl } from "./http.util";
import Game from "../models/game";
import { Parser } from "htmlparser2";
import { DomHandler } from "htmlparser2";
import { DomUtils } from "htmlparser2";
const CSSselect = require("css-select");

export type BoardGameGeekResource = Partial<Game> & {
  timestamp: string;
};

export default class BoardGameGeekReader {
  constructor(public baseUrl: string) {}

  getResourceForGameId(gameId: string) {
    return new Promise<BoardGameGeekResource>(async (resolve, reject) => {
      const resourceUri = `/boardgame/${gameId}`;
      const gameUrl = new URL(resourceUri, this.baseUrl);
      const html = await getContentAtUrl(gameUrl);

      const handler = new DomHandler((error, dom) => {
        if (error) {
          // Handle error
          reject(error);
        } else {
          // Parsing completed, do something
          console.log(dom);

          let boardGGResource: BoardGameGeekResource = {
            boardGameGeekId: gameId,
            title: CSSselect.selectOne(
              "div.game-header-title:nth-child(2) > div:nth-child(2) > h1:nth-child(1) > a:nth-child(1)"
            ),
            timestamp: new Date().toISOString(),
          };

          resolve(boardGGResource);
        }
      });
      const parser = new Parser(handler);
      parser.write(html);
      parser.end();
    });
  }
}
