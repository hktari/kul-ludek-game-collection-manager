import * as XLSX from "xlsx";
import Game from "../models/game";
import fs from "fs";
import path from "path";

function _stripExtension(filePath: string) {}

function generateStarterSpreadsheet(filePath: string) {
  const rows = [new Game("0", "0")];
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

function _parseGame(gameProps: any) {
  if (!gameProps.id || !gameProps.boardGameGeekId) {
    // todo: log error
    return undefined;
  }

  const game = new Game(gameProps.id, gameProps.boardGameGeekId);
  return Object.assign(game, gameProps);
}

function readInSpreadsheet(filePath: string): Game[] {
  const workbook = XLSX.readFile(filePath);
  const gamesPlain = XLSX.utils.sheet_to_json(workbook.Sheets["Games"]);
  return gamesPlain
    .map((gameProps) => _parseGame(gameProps))
    .filter((game) => game); // remove undefined
}

export { generateStarterSpreadsheet, readInSpreadsheet };
