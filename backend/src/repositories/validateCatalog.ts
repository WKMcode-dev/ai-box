import { SECURITY_SUBCATEGORIES, TOOL_CATEGORIES, type Tool } from "@ai-box/contracts";

const requiredFields = [
  "id", "name", "maker", "category", "description", "url", "logoLabel",
  "color", "usageNote", "sourceUrl", "pricingSourceUrl", "checkedAt",
] as const;

function isValidLogoPath(logo: unknown): logo is string {
  return typeof logo === "string" && /^\/logos\/[a-z0-9-]+\.svg$/.test(logo);
}

export function validateCatalog(value: unknown): Tool[] {
  if (!Array.isArray(value)) throw new Error("O catálogo deve ser uma lista.");

  const validated: Tool[] = [];
  const ids = new Set<string>();

  for (const candidate of value as unknown[]) {
    if (!candidate || typeof candidate !== "object") throw new Error("Item inválido.");
    const entry = candidate as Record<string, any>;

    for (const field of requiredFields) {
      if (typeof entry[field] !== "string" || !entry[field].trim()) {
        throw new Error("Campo inválido: " + field);
      }
    }

    if (
      !Array.isArray(entry.tags) ||
      !entry.tags.every((tag: unknown) => typeof tag === "string") ||
      typeof entry.featured !== "boolean"
    ) throw new Error("Tags ou destaque inválidos.");

    for (const field of ["url", "sourceUrl", "pricingSourceUrl"] as const) {
      if (new URL(entry[field]).protocol !== "https:") throw new Error("Use links oficiais HTTPS.");
    }

    const logoValid = isValidLogoPath(entry.logo);
    if (
      (entry.logoKind === "brand" && !logoValid) ||
      (entry.logoKind === "generated" && !logoValid) ||
      (entry.logoKind === "text" && entry.logo !== null) ||
      !["brand", "generated", "text"].includes(entry.logoKind) ||
      !entry.logo
    ) throw new Error("Caminho de logo inválido ou SVG ausente.");

    if (!TOOL_CATEGORIES.includes(entry.category)) throw new Error("Categoria inválida.");
    if (
      (entry.category === "Cibersegurança" && !SECURITY_SUBCATEGORIES.includes(entry.subcategory)) ||
      (entry.category !== "Cibersegurança" && entry.subcategory !== undefined)
    ) throw new Error("Subcategoria inválida para " + entry.id);

    if (!["local", "self-hosted", "browser", "online", "desktop"].includes(entry.access)) {
      throw new Error("Modalidade inválida.");
    }
    if (!["Aplicativo", "Modelo", "Framework"].includes(entry.kind)) {
      throw new Error("Tipo inválido para " + entry.id + ": " + entry.kind);
    }
    if (!["free", "freemium"].includes(entry.pricing)) {
      throw new Error("A seleção aceita apenas opções gratuitas ou com plano gratuito verificado.");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.checkedAt)) {
      throw new Error("Data de revisão inválida.");
    }
    if (ids.has(entry.id)) throw new Error("ID duplicado: " + entry.id);

    ids.add(entry.id);
    validated.push(candidate as Tool);
  }

  return validated;
}
