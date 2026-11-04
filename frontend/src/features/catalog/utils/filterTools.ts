import type { Tool } from "@ai-box/contracts";
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}
export function filterTools(
  tools: Tool[],
  category: string,
  query: string,
  sort: string,
  access = "all",
  pricing = "all",
): Tool[] {
  const term = normalize(query.trim());
  return tools
    .filter(
      (tool) =>
        (category === "Todas as IAs" || tool.category === category) &&
        (access === "all" || tool.access === access) &&
        (pricing === "all" || tool.pricing === pricing) &&
        normalize(
          [
            tool.name,
            tool.maker,
            tool.category,
            tool.description,
            ...tool.tags,
          ].join(" "),
        ).includes(term),
    )
    .sort((a, b) =>
      sort === "az"
        ? a.name.localeCompare(b.name, "pt-BR")
        : Number(b.featured) - Number(a.featured),
    );
}
