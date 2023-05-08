import { BoardGameGeekResource } from "./boardGameGeekReader";
import { parseMinAge, parseMinMaxPlayers } from "./boardGameGeekReader.util";
import { SelectedWebData } from "./websiteInspector";

type ParseResult = [
  resource: BoardGameGeekResource,
  errors: Record<string, string> | undefined
];
export default class BoardGameGeekReaderParser {
  private parseErrors: Record<string, string> = {};

  private _performParseDataProperty(
    propertyName: string,
    parserFunction: VoidFunction
  ) {
    try {
      parserFunction();
    } catch (error: any) {
      this.parseErrors[propertyName] = error.message;
    }
  }

  parse(websiteData: SelectedWebData): ParseResult {
    let minPlayers, maxPlayers;
    if (websiteData.minMaxPlayers) {
      const minMaxPlayersRaw = websiteData.minMaxPlayers;
      this._performParseDataProperty("minMaxPlayers", () => {
        [minPlayers, maxPlayers] = parseMinMaxPlayers(minMaxPlayersRaw);
      });
    }

    let minAge;
    if (websiteData.minAge) {
      const minAgeRaw = websiteData.minAge;
      this._performParseDataProperty("minAge", () => {
        minAge = parseMinAge(minAgeRaw);
      });
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

    return [game, this.parseErrors];
  }
}
