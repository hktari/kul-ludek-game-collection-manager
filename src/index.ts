import {
  generateStarterSpreadsheet,
  readInSpreadsheet,
  writeSpreadsheet,
} from "./xlsx/spreadSheetManager";
import { Command } from "commander";
import path from "path";
import Game from "./models/game";
import BoardGameGeekReader from "./dom/boardGameGeekReader";
import util from "util";
import GameCollectionManager from "./manager/gameCollectionManager";

const program = new Command();

const outputDir = "output";

program
  .name("gcm")
  .description(
    `Game Collection Manager manages a spreadsheet file. Updating it with data from board game websites. The resulting spreadsheet can be used to search and manage your board game collection`
  )
  .version("0.1.0");

program
  .command("generate-starter")
  .description("Generate a starter spreadsheet file with relevant headers.")
  .argument(
    "[output-file]",
    "The path where the generated file will be saved.",
    path.join(outputDir, "game-collection.xlsx")
  )
  .action((fileName, options) => {
    const filePathParsed = path.parse(fileName);

    console.log(
      `Generating a starter spreadsheet file at '${path.join(
        filePathParsed.dir,
        filePathParsed.base
      )}' for your game collection...`
    );

    generateStarterSpreadsheet(filePathParsed);
    console.log("Done.");
  });

program
  .command("update")
  .description(
    "Updates a spreadsheet file with newest data pulled from the web."
  )
  .argument("<input-file>", "Your board game collection in a .xlsx file")
  .action(async (inputFile, options) => {
    console.log(`Parsing file ${inputFile}...`);

    const filePathParsed = path.parse(inputFile);

    const games = readInSpreadsheet(filePathParsed);

    const bgcm = new GameCollectionManager();
    console.log("updating...");
    const updatedGames = await bgcm.update(games);

    console.log("saving...");
    const outFileName = `${filePathParsed.name}-updated${filePathParsed.ext}`;
    const outputPath = path.join(filePathParsed.dir, outFileName);
    writeSpreadsheet(updatedGames, path.parse(outputPath));

    console.log("Done.");
  });

program.parse();

export default {};
