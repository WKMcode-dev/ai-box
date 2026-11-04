import type { CatalogResponse } from "@ai-box/contracts";
import { readCatalog } from "../repositories/catalogRepository.js";
export async function getCatalog(): Promise<CatalogResponse> {
  return { tools: await readCatalog() };
}
