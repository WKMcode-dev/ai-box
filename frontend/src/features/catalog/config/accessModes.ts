import type { AccessMode } from "@ai-box/contracts";
export const accessLabels: Record<AccessMode, string> = {
  online: "Site / aplicativo online",
  desktop: "Aplicativo com nuvem",
  local: "No computador",
  "self-hosted": "Hospedagem própria",
  browser: "No navegador",
};
