import BoardGameGeekReader, {
  BoardGameGeekResource,
} from "./boardGameGeekReader";

describe("boardGameGeekReader", () => {
  let boardGGReader: BoardGameGeekReader;
  beforeEach(() => {
    boardGGReader = new BoardGameGeekReader("https://boardgamegeek.com");
  });

  describe("getResourceForGameId", () => {
    it("should return an object with id and title", () => {
      const resourceId = "321608";
      return expect(
        boardGGReader.getResourceForGameId(resourceId)
      ).resolves.toMatchObject<Partial<BoardGameGeekResource>>({
        boardGameGeekId: "321608",
        title: "Hegemony: Lead Your Class to Victory",
      });
    }, 10000);
  });
});
