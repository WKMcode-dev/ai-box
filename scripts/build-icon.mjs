import { readFile, writeFile, mkdir } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
const directory = new URL("../desktop/build/", import.meta.url);
await mkdir(directory, { recursive: true });
const svg = await readFile(
  new URL("../frontend/public/favicon.svg", import.meta.url),
  "utf8",
);
const png = new Resvg(svg, { fitTo: { mode: "width", value: 256 } })
  .render()
  .asPng();
await writeFile(new URL("icon.png", directory), png);
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(new URL("icon.ico", directory), Buffer.concat([header, png]));
