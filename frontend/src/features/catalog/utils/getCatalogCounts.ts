import type { Tool } from "@ai-box/contracts";

export function getCatalogCounts(tools: readonly Tool[]) {
  const byCategory = new Map<string, number>();
  for (const { category } of tools) {
    byCategory.set(category, (byCategory.get(category) ?? 0) + 1);
  }

  const security = byCategory.get("Cibersegurança") ?? 0;
  return { ai: tools.length - security, security, byCategory };
}

export type CatalogCounts = ReturnType<typeof getCatalogCounts>;
