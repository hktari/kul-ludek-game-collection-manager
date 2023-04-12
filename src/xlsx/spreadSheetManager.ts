import * as XLSX from "xlsx";
import Game from "../models/game";
import fs from "fs";
import path from "path";

function _stripExtension(filePath: string) {}

export const sampleGame: Game = Object.assign(new Game("0", "4324"), {
  boardGameGeekId: "4324",
  title: "Risk: The Lord of the Rings",
  description:
    'A Lord-of-the-Rings-themed version of Risk, with the following differences:\n\nThe map is of Middle Earth, and the tokens represent armies of that fictional world.\n(Note that in this "Two Towers edition", the first version of the game, the map is incomplete, unless you own the expansion. For the newer version with complete map, see the reimplementation of this, the "trilogy edition".)\n\nYou play either good or evil.\n\nLeaders, missions and sites of power have been added.\n\nThe One Ring acts as a timing mechanism, when it leaves the board, the game ends.\n\nComponents for this "Two Towers edition":\n("trilogy edition" has 90 per army)\n\n40 Elven Archers/Orcs\n12 Riders of Rohan/Dark Riders\n6 Eagles/Cave Trolls\n2 shields per color\n\nGameboard\n4 Complete armies in different colors: (60 per color)\n42 Territory Cards (9 Good, 9 Evil, 24 Neutral)\n2 Wild Cards\n40 Adventure Cards\nThe One Ring\n3 Red Dice\n2 Black Dice',
  genre: "Adventure",
  publisher: "Hasbro",
  releaseDateYear: "(2002)",
});

function generateStarterSpreadsheet(filePath: path.ParsedPath) {
  const games = [sampleGame];
  writeSpreadsheet(games, filePath);
}

function _parseGame(gameProps: any) {
  if (!gameProps.id || !gameProps.boardGameGeekId) {
    // todo: log error
    return undefined;
  }

  const game = new Game(gameProps.id, gameProps.boardGameGeekId);
  return Object.assign(game, gameProps);
}

function readInSpreadsheet(filePath: path.ParsedPath): Game[] {
  const workbook = XLSX.readFile(path.format(filePath));
  const gamesPlain = XLSX.utils.sheet_to_json(workbook.Sheets["Games"]);
  return gamesPlain
    .map((gameProps) => _parseGame(gameProps))
    .filter((game) => game); // remove undefined
}

/**
 * Writes given game data to the given file path. This will overwrite any existing data.
 * @param games game data to be written
 * @param filePath spreadsheet output file path
 */
function writeSpreadsheet(games: Game[], filePath: path.ParsedPath) {
  const worksheet = XLSX.utils.json_to_sheet(games);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Games");

  const outFilePath = `${path.join(filePath.dir, filePath.name)}.xlsx`;

  if (filePath.dir && !fs.existsSync(filePath.dir)) {
    fs.mkdirSync(filePath.dir);
  }

  XLSX.writeFile(workbook, outFilePath);
}

export { generateStarterSpreadsheet, readInSpreadsheet };
