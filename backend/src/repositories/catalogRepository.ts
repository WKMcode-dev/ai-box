import { readFile } from "node:fs/promises";
import type { Tool } from "@ai-box/contracts";
import { validateCatalog } from "./validateCatalog.js";
const catalogPath = new URL("../../data/catalog.json", import.meta.url);
export async function readCatalog(): Promise<Tool[]> {
  const contents = await readFile(catalogPath, "utf8");
  return validateCatalog(JSON.parse(contents.replace(/^\uFEFF/, "")));
}
