import {
  generateStarterSpreadsheet,
  readInSpreadsheet,
} from "./spreadSheetManager";
import fs from "fs";
import Game from "../models/game";

describe("spreadSheetManager", () => {
  const starterFileName = "test";
  const starterFilePath = `./${starterFileName}.xlsx`;

  describe("generateStarterSpreadsheet", () => {
    it('should create a file name "test.xlsx', () => {
      generateStarterSpreadsheet(starterFileName);

      expect(fs.existsSync(starterFilePath)).toBeTruthy();
    });

    it("should create a file given a directory path + name", () => {
      const fileNameSubdir = "./output/test";
      generateStarterSpreadsheet(fileNameSubdir);
      const filePath = `./${fileNameSubdir}.xlsx`;

      expect(fs.existsSync(filePath)).toBeTruthy();
    });
  });

  describe("readInSpreadsheet", () => {
    let gamesArray: Game[];

    beforeEach(() => {
      gamesArray = readInSpreadsheet(starterFilePath);
    });

    it("should return an array with a single entry", () => {
      expect(gamesArray).toBeDefined();
      expect(gamesArray.length).toBe(1);
    });

    it("should return an object of type Game", () => {
      const game = gamesArray[0];
      expect(game).toMatchObject<Game>({ id: "0", boardGameGeekId: "0" });
      expect(game instanceof Game).toBeTruthy();
    });
  });
});
