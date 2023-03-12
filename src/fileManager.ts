import * as XLSX from "xlsx";

/* load 'fs' for readFile and writeFile support */
import * as fs from "node:fs";

import Game from "./models/game";

XLSX.set_fs(fs);

/* load 'stream' for stream support */
// import { Readable } from "stream";

// XLSX.stream.set_readable(Readable);

function generateStarterSpreadsheet() {
  const rows = [new Game("0", "12932")];
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.writeFile(worksheet, "sheetjs.xlsx");
}

export { generateStarterSpreadsheet };
