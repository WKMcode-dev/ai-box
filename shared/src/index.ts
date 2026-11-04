export const TOOL_CATEGORIES = [
  "Texto",
  "Imagem",
  "Vídeo",
  "Áudio",
  "Código",
  "Produtividade",
  "Pesquisa",
] as const;
export type AccessMode =
  "local" | "self-hosted" | "browser" | "online" | "desktop";
export interface Tool {
  id: string;
  name: string;
  maker: string;
  category: (typeof TOOL_CATEGORIES)[number];
  description: string;
  url: string;
  logo: string | null;
  logoLabel: string;
  logoKind: "brand" | "text";
  tags: string[];
  color: string;
  featured: boolean;
  access: AccessMode;
  kind: "Aplicativo" | "Modelo" | "Framework";
  pricing: "free" | "freemium";
  pricingSourceUrl: string;
  usageNote: string;
  sourceUrl: string;
  checkedAt: string;
}
export interface CatalogResponse {
  tools: Tool[];
}
export interface ApiError {
  error: string;
}
