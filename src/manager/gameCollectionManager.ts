import BoardGameGeekReader from "@src/dom/boardGameGeekReader";
import Game from "@src/models/game";

export default class GameCollectionManager {
  readonly boardGameReader: BoardGameGeekReader;

  constructor() {
    this.boardGameReader = new BoardGameGeekReader(
      "https://boardgamegeek.com/"
    );
  }

  update(games: Game[]): Promise<Game[]> {
    const gameUpdates = games.map((game) =>
      this.boardGameReader.getResourceForGameId(game.boardGameGeekId)
    );

    return Promise.allSettled(gameUpdates).then((results) => {
      const updatedGames: Game[] = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          const gameUpdateData = result.value;
          const gameToUpdate: Game | undefined = games.find(
            (game) => game.id === gameUpdateData.id
          );
          
          if (!gameToUpdate) {
            throw new Error(`Failed to update game ${gameUpdateData.id}`);
          }
          
          const updatedGame = Object.assign(gameToUpdate, gameUpdateData);
          updatedGames.push(updatedGame);
        }
      });

      return updatedGames;
    });
  }
}
