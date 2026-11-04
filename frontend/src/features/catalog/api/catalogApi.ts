import type { CatalogResponse } from "@ai-box/contracts";
import { assetUrl } from "../../../utils/assetUrl";
export async function getCatalog(
  signal?: AbortSignal,
): Promise<CatalogResponse> {
  const endpoint =
    import.meta.env.VITE_CATALOG_SOURCE === "static"
      ? assetUrl("catalog.json")
      : "/api/tools";
  const response = await fetch(endpoint, { signal });
  if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
  return response.json() as Promise<CatalogResponse>;
}
