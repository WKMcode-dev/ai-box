import { readFile, writeFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
const logo = (
  await readFile(
    new URL("../frontend/public/favicon.svg", import.meta.url),
    "utf8",
  )
).replace("<svg ", '<svg x="0" y="0" width="48" height="48" ');
function bmp(rendered) {
  const { width: w, height: h, pixels } = rendered,
    stride = Math.ceil((w * 3) / 4) * 4;
  const b = Buffer.alloc(54 + stride * h);
  b.write("BM");
  b.writeUInt32LE(b.length, 2);
  b.writeUInt32LE(54, 10);
  b.writeUInt32LE(40, 14);
  b.writeInt32LE(w, 18);
  b.writeInt32LE(h, 22);
  b.writeUInt16LE(1, 26);
  b.writeUInt16LE(24, 28);
  b.writeUInt32LE(stride * h, 34);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const src = (y * w + x) * 4,
        dst = 54 + (h - 1 - y) * stride + x * 3;
      b[dst] = pixels[src + 2];
      b[dst + 1] = pixels[src + 1];
      b[dst + 2] = pixels[src];
    }
  return b;
}
const sidebar = `<svg xmlns="http://www.w3.org/2000/svg" width="164" height="314"><rect width="164" height="314" fill="#111310"/><path d="M0 260 164 170M0 280 164 190M0 300 164 210" stroke="#2b3921"/><g transform="translate(24 28) scale(1.25)">${logo}</g><g fill="#eceee8" font-family="sans-serif"><text x="24" y="129" font-size="22" font-weight="700">A.I BOX</text><text x="24" y="155" font-size="10" fill="#c0f582">Seu universo de IA.</text><text x="24" y="284" font-size="9" fill="#a2ad98">WKMcode</text></g><path d="M24 182h48" stroke="#c0f582" stroke-width="2"/></svg>`;
const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="57"><rect width="150" height="57" fill="#111310"/><g transform="translate(9 9) scale(.8)">${logo}</g><text x="55" y="34" fill="#c0f582" font-size="16" font-family="sans-serif" font-weight="700">A.I BOX</text></svg>`;
for (const [name, svg] of [
  ["installerSidebar", sidebar],
  ["installerHeader", banner],
]) {
  await writeFile(
    new URL("../desktop/build/" + name + ".svg", import.meta.url),
    svg,
  );
  await writeFile(
    new URL("../desktop/build/" + name + ".bmp", import.meta.url),
    bmp(
      new Resvg(svg, {
        font: {
          sansSerifFamily:
            process.platform === "win32" ? "Arial" : "DejaVu Sans",
        },
      }).render(),
    ),
  );
}
