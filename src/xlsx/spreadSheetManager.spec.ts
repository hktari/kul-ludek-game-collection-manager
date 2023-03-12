import {
  generateStarterSpreadsheet,
  readInSpreadsheet,
} from "./spreadSheetManager";
import fs from "fs";

describe("generateStarterSpreadsheet", () => {
  it('should create a file name "test.xlsx', () => {
    const starterFileName = "test";
    generateStarterSpreadsheet(starterFileName);
    const filePath = `./${starterFileName}.xlsx`;
    
    expect(fs.existsSync(filePath)).toBeTruthy();
  });

  it("should create a file given a directory path + name", () => {
    const fileNameSubdir = "./output/test";
    generateStarterSpreadsheet(fileNameSubdir);
    const filePath = `./${fileNameSubdir}.xlsx`;
    
    expect(fs.existsSync(filePath)).toBeTruthy();
  });
});
