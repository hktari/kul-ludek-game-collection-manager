import Game from "../models/game";
import GameCollectionManager from "./gameCollectionManager";
import BoardGameGeekReader, {
  BoardGameGeekResource,
} from "../dom/boardGameGeekReader";

// jest.mock("../dom/boardGameGeekReader", () => {
//   return function () {
//     const gameUpdateResource: BoardGameGeekResource = {
//       id: "0",
//       boardGameGeekId: "4324",
//       title: "Update Game Title",
//       description: "Updated Game Description",
//       timestamp: "2023-03-21T06:44:24.521Z",
//     };
//     return {
//       getResourceForGameId: (_: string) => Promise.resolve(gameUpdateResource),
//     };
//   };
// });

const BoardGameGeekReaderMock =
  BoardGameGeekReader as jest.Mock<BoardGameGeekReader>;

describe("gameCollectionManager", () => {
  let gameCollectionManager: GameCollectionManager;
  const games = [new Game("0", "4324"), new Game("1", "350184")];

  beforeEach(() => {
    gameCollectionManager = new GameCollectionManager();
  });

  describe("update", () => {
    let boardGameGeekReaderMock: jest.SpyInstance<
      Promise<BoardGameGeekResource>
    >;

    const gameUpdateResources: Record<string, BoardGameGeekResource> = {
      "4324": {
        id: "0",
        boardGameGeekId: "4324",
        title: "Update Game Title",
        description: "Updated Game Description",
        timestamp: "2023-03-21T06:44:24.521Z",
      },
      "350184": {
        id: "1",
        boardGameGeekId: "350184",
        title: "Update Second Game",
        minAge: 2,
        maxAge: 99,
        timestamp: "2023-03-21T06:44:24.521Z",
      },
    };

    beforeAll(() => {
      boardGameGeekReaderMock = jest
        .spyOn(BoardGameGeekReader.prototype, "getResourceForGameId")
        .mockImplementation((gameId: string) =>
          Promise.resolve(gameUpdateResources[gameId])
        );
    });

    beforeEach(() => {
      // boardGameGeekReaderMock.mockClear()
    });

    it("should return all entries given to it", () => {
      return expect(gameCollectionManager.update(games)).resolves.toHaveLength(
        2
      );
    });

    it("entries should have title field added", async () => {
      const updates = await gameCollectionManager.update(games);
      updates.forEach((update) => {
        expect(update.title).toBeTruthy();
      });
    });

    it("entries should have attributes overwritten", async () => {
      const outdatedGame = games[0];
      const updatedGameResource =
        gameUpdateResources[outdatedGame.boardGameGeekId];

      const [updatedGame] = await gameCollectionManager.update([outdatedGame]);

      expect(boardGameGeekReaderMock).toHaveBeenCalled();
      expect(updatedGame).toMatchObject(updatedGameResource);
    });

    it("rejected entries should have errors field", async () => {
      const gameError: Game = new Game("unknownId", "unknownId");
      const gameOk: Game = new Game("0", "12345");

      const successfulGameUpdateResponse: BoardGameGeekResource = {
        ...gameOk,
        timestamp: "",
        title: "Update Game Title",
      };

      const failedGameUpdateResponse: BoardGameGeekResource = {
        ...gameError,
        errors: "Update Failed. Unknown error occured.",
        timestamp: "",
      };

      boardGameGeekReaderMock.mockReset();
      boardGameGeekReaderMock.mockImplementation((gameId: string) => {
        return gameId === "unknownId"
          ? Promise.reject(failedGameUpdateResponse)
          : Promise.resolve(successfulGameUpdateResponse);
      });

      const [okGameUpdate, failedGameUpdate] =
        await gameCollectionManager.update([gameOk, gameError]);

      expect(okGameUpdate).toMatchObject(successfulGameUpdateResponse);
      expect(failedGameUpdate).toMatchObject(failedGameUpdateResponse);
    });
  });
});
