import * as XLSX from "xlsx";
import Game from "../models/game";
import fs from "fs";
import path from "path";

function _stripExtension(filePath: string) {}

function generateStarterSpreadsheet(filePath: string) {
  const rows = [new Game("0", "12932")];
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Games");

  const parsedPath = path.parse(filePath);
  const outFilePath = `${path.join(parsedPath.dir, parsedPath.name)}.xlsx`;

  if (parsedPath.dir && !fs.existsSync(parsedPath.dir)) {
    fs.mkdirSync(parsedPath.dir);
  }

  XLSX.writeFile(workbook, outFilePath);
}

function readInSpreadsheet(fileName: string): Game[] {
  const workbook = XLSX.readFile(fileName);
  return XLSX.utils.sheet_to_json(workbook.Sheets["Games"]);
}

export { generateStarterSpreadsheet, readInSpreadsheet };
