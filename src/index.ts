import { generateStarterSpreadsheet } from "./xlsx/spreadSheetManager";
import { Command } from "commander";
const program = new Command();

program
  .name("gcm")
  .description(
    `Game Collection Manager manages a spreadsheet file. Updating it with data from board game websites. The resulting spreadsheet can be used to search and manage your board game collection`
  )
  .version("0.1.0");

program
  .command("update")
  .description(
    "Updates a spreadsheet file with newest data pulled from the web."
  )
  .argument("<input-file>", "Your board game collection in a .xlsx file")
  .action((inputFile, options) => {
    console.log(`Parsing file ${inputFile}...`);

    console.log('Done.')
  });

program.parse();

export default {};
