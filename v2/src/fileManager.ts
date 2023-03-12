import * as XLSX from "xlsx";

/* load 'fs' for readFile and writeFile support */
import * as fs from "node:fs";

import Game from "./models/game";

/* load 'stream' for stream support */
// import { Readable } from "stream";

// XLSX.stream.set_readable(Readable);

function generateStarterSpreadsheet() {
  const rows = [new Game("0", "12932")];
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Games");

  XLSX.writeFile(workbook, "sheetjs.xlsx");
}

export { generateStarterSpreadsheet };
