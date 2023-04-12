import Game from "../models/game";
import GameCollectionManager from "./gameCollectionManager";

describe("gameCollectionManager", () => {
  let gameCollectionManager: GameCollectionManager;
  const games = [new Game("0", "4324"), new Game("1", "350184")];

  beforeEach(() => {
    gameCollectionManager = new GameCollectionManager();
  });

  describe("update", () => {
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
  });
});
