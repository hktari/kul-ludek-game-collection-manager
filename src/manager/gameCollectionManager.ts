import BoardGameGeekReader from "../dom/boardGameGeekReader";
import Game from "../models/game";

export default class GameCollectionManager {
  readonly boardGameReader: BoardGameGeekReader;

  constructor() {
    this.boardGameReader = new BoardGameGeekReader(
      "https://boardgamegeek.com/"
    );
  }

  private _addTimestamp(game: Game) {
    game.lastUpdateTimestamp = new Date().toISOString();
  }

  update(games: Game[]): Promise<Game[]> {
    const gameUpdates = games.map((game) =>
      this.boardGameReader.getResourceForGameId(game.boardGameGeekId)
    );

    return Promise.allSettled(gameUpdates).then((results) => {
      const gameUpdateResults: Game[] = [];
      results.forEach((result, resultIdx) => {
        if (result.status === "fulfilled") {
          const gameUpdateData = result.value;
          const gameToUpdate: Game | undefined = games.find(
            (game) => game.boardGameGeekId === gameUpdateData.boardGameGeekId
          );

          if (!gameToUpdate) {
            throw new Error(`Failed to update game ${gameUpdateData.id}`);
          }

          const updatedGame = Object.assign(gameToUpdate, gameUpdateData);
          this._addTimestamp(updatedGame);
          gameUpdateResults.push(updatedGame);
        } else {
          // any remaining unhandled errors
          const unupdatedGame = games[resultIdx];
          unupdatedGame.errors = result.reason;
          this._addTimestamp(unupdatedGame);
          gameUpdateResults.push(unupdatedGame);
        }
      });

      return gameUpdateResults;
    });
  }
}
