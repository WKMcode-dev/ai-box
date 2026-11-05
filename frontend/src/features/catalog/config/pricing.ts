import type { Tool } from "@ai-box/contracts";
export const pricingLabels: Record<Tool["pricing"], string> = {
  free: "Gratuito no modo indicado",
  freemium: "Plano gratuito com limites",
  paid: "Acesso pago / créditos de API",
};
export const accessNotes = {
  online:
    "Serviço online; pode exigir conta gratuita. Os limites e recursos variam por plano.",
  desktop:
    "Requer aplicativo e conexão ao serviço. Pode exigir uma conta gratuita.",
  browser: "Processamento no dispositivo pelo navegador.",
  local: "Requer instalação e recursos do seu computador.",
  "self-hosted": "Requer instalação e hospedagem própria.",
};
