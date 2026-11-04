import { writeFile, access } from "node:fs/promises";
import { runNpm } from "./run-npm.mjs";
const target = process.argv[2];
if (!["pages", "desktop"].includes(target))
  throw new Error("Use pages ou desktop.");
runNpm(["run", "build", "-w", "@ai-box/contracts"]);
runNpm(["run", "build", "-w", "@ai-box/backend"]);
const { getCatalog } =
  await import("../backend/dist/services/catalogService.js");
const catalog = await getCatalog();
for (const tool of catalog.tools)
  if (tool.logo)
    await access(new URL("../frontend/public" + tool.logo, import.meta.url));
const base =
  target === "pages" ? process.env.PAGES_BASE_PATH || "/ai-box/" : "./";
runNpm(["run", "build", "-w", "@ai-box/frontend"], {
  ...process.env,
  VITE_BASE_PATH: base,
  VITE_CATALOG_SOURCE: "static",
  AI_BOX_OUTPUT_DIR: `dist-${target}`,
});
const output = new URL(`../frontend/dist-${target}/`, import.meta.url);
await writeFile(new URL("catalog.json", output), JSON.stringify(catalog));
await writeFile(new URL(".nojekyll", output), "");
console.log(
  `${target}: ${catalog.tools.length} entradas; base ${base}; catálogo estático validado.`,
);
