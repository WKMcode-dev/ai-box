export const TOOL_CATEGORIES = [
  "Texto",
  "Imagem",
  "Vídeo",
  "Áudio",
  "Código",
  "Produtividade",
  "Pesquisa",
  "Cibersegurança",
] as const;
export const SECURITY_SUBCATEGORIES = [
  "Reconhecimento",
  "Análise de vulnerabilidades",
  "Ferramentas web",
  "Captura e análise de tráfego",
  "Engenharia reversa",
  "Forense digital",
  "Auditoria de senhas",
  "Análise de malware",
  "Protocolos e serviços de rede",
] as const;
export type SecuritySubcategory = (typeof SECURITY_SUBCATEGORIES)[number];
export type AccessMode =
  "local" | "self-hosted" | "browser" | "online" | "desktop";
export interface Tool {
  id: string;
  name: string;
  maker: string;
  category: (typeof TOOL_CATEGORIES)[number];
  subcategory?: SecuritySubcategory;
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
