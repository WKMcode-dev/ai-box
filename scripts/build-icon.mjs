import { readFile, writeFile, mkdir } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
const directory = new URL("../desktop/build/", import.meta.url);
await mkdir(directory, { recursive: true });
const svg = await readFile(
  new URL("../frontend/public/favicon.svg", import.meta.url),
  "utf8",
);
const sizes = [16, 20, 24, 32, 40, 48, 64, 128, 256];
const images = sizes.map((size) =>
  new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng(),
);
await writeFile(new URL("icon.png", directory), images.at(-1));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((png, i) => {
  const at = 6 + i * 16;
  header[at] = header[at + 1] = sizes[i] === 256 ? 0 : sizes[i];
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(png.length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += png.length;
});
await writeFile(
  new URL("icon.ico", directory),
  Buffer.concat([header, ...images]),
);
