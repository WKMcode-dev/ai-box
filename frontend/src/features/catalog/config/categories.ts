import { TOOL_CATEGORIES } from "@ai-box/contracts";
export const categories = ["Todas as IAs", ...TOOL_CATEGORIES.filter((category) => category !== "Cibersegurança")];
