import BoardGameGeekReader, {
  BoardGameGeekResource,
} from "./boardGameGeekReader";

describe("boardGameGeekReader", () => {
  describe("getResourceForGameId", () => {
    it("should return an object with id and title", () => {
      const boardGGReader = new BoardGameGeekReader(
        "https://boardgamegeek.com"
      );
      const resourceId = "321608";
      return expect(
        boardGGReader.getResourceForGameId(resourceId)
      ).resolves.toMatchObject<BoardGameGeekResource>({
        boardGameGeekId: resourceId,
        title: "Hegemony: Lead Your Class to Victory",
        timestamp: "",
      });
    });
  });
});
