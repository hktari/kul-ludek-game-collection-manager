import {
  generateStarterSpreadsheet,
  readInSpreadsheet,
  sampleGame,
} from "./spreadSheetManager";
import fs from "fs";
import Game from "../models/game";
import path from "path";

describe("spreadSheetManager", () => {
  const filePath = path.join("test.xlsx");

  describe("generateStarterSpreadsheet", () => {
    it('should create a file name "test.xlsx', () => {
      generateStarterSpreadsheet(path.parse(filePath));

      expect(fs.existsSync(filePath)).toBeTruthy();
    });

    it("should create a file given a directory path + name", () => {
      const filePathSubdir = path.join("output", "test.xlsx");

      generateStarterSpreadsheet(path.parse(filePathSubdir));

      expect(fs.existsSync(filePathSubdir)).toBeTruthy();
    });
  });

  describe("readInSpreadsheet", () => {
    let gamesArray: Game[];

    beforeEach(() => {
      gamesArray = readInSpreadsheet(path.parse(filePath));
    });

    it("should return an array with a single entry", () => {
      expect(gamesArray).toBeDefined();
      expect(gamesArray.length).toBe(1);
    });

    it("should return the sample object of type Game", () => {
      const game = gamesArray[0];
      expect(game).toMatchObject<Game>(sampleGame);
      expect(game instanceof Game).toBeTruthy();
    });
  });
});
