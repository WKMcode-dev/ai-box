import { TOOL_CATEGORIES, type Tool } from "@ai-box/contracts";
const fields = [
  "id",
  "name",
  "maker",
  "category",
  "description",
  "url",
  "logoLabel",
  "color",
  "usageNote",
  "sourceUrl",
  "pricingSourceUrl",
  "checkedAt",
] as const;
export function validateCatalog(value: unknown): Tool[] {
  if (!Array.isArray(value)) throw new Error("O catálogo deve ser uma lista.");
  const ids = new Set<string>();
  for (const entry of value) {
    if (!entry || typeof entry !== "object") throw new Error("Item inválido.");
    for (const field of fields)
      if (typeof entry[field] !== "string" || !entry[field].trim())
        throw new Error(`Campo inválido: ${field}`);
    if (
      !Array.isArray(entry.tags) ||
      !entry.tags.every((tag: unknown) => typeof tag === "string") ||
      typeof entry.featured !== "boolean"
    )
      throw new Error("Tags ou destaque inválidos.");
    for (const field of ["url", "sourceUrl", "pricingSourceUrl"])
      if (new URL(entry[field]).protocol !== "https:")
        throw new Error("Use links oficiais HTTPS.");
    if (
      (entry.logoKind === "brand" &&
        (typeof entry.logo !== "string" ||
          !/^\/logos\/[a-z0-9-]+\.svg$/.test(entry.logo))) ||
      (entry.logoKind === "text" && entry.logo !== null) ||
      !["brand", "text"].includes(entry.logoKind)
    )
      throw new Error("Caminho de logo inválido.");
    if (!TOOL_CATEGORIES.includes(entry.category))
      throw new Error("Categoria inválida.");
    if (
      !["local", "self-hosted", "browser", "online", "desktop"].includes(
        entry.access,
      )
    )
      throw new Error("Modalidade inválida.");
    if (!["Aplicativo", "Modelo", "Framework"].includes(entry.kind))
      throw new Error(`Tipo inválido para ${entry.id}: ${entry.kind}.`);
    if (!["free", "freemium"].includes(entry.pricing))
      throw new Error(
        "A seleção aceita apenas opções gratuitas ou com plano gratuito verificado.",
      );
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.checkedAt))
      throw new Error("Data de revisão inválida.");
    if (ids.has(entry.id)) throw new Error(`ID duplicado: ${entry.id}`);
    ids.add(entry.id);
  }
  return value as Tool[];
}
