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
  "Reconhecimento e OSINT",
  "Enumeração de redes e serviços",
  "Análise de vulnerabilidades",
  "Segurança de aplicações web",
  "Captura, análise e manipulação de tráfego",
  "Auditoria de senhas e autenticação",
  "Engenharia reversa e análise de binários",
  "Análise de malware e resposta a incidentes",
  "Forense digital e recuperação",
  "Active Directory e ambientes Windows",
  "Wireless, Bluetooth e RFID",
  "Hardware, SDR e IoT",
  "Fuzzing e teste de protocolos",
  "Criptografia e esteganografia",
  "Cloud, containers e Kubernetes",
  "Monitoramento, defesa e hardening",
  "VoIP e telecomunicações",
  "Relatórios e gestão de pentest",
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
  sourceDistro?: "Kali" | "Ubuntu" | "Complementar";
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
