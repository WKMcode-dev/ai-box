import type { Tool } from "@ai-box/contracts";
interface Props {
  pricing: string;
  setPricing: (value: string) => void;
}
export function PricingFilter({ pricing, setPricing }: Props) {
  return (
    <label className="pricing-filter">
      Gratuidade{" "}
      <select
        aria-label="Filtrar gratuidade"
        value={pricing}
        onChange={(e) => setPricing(e.target.value)}
      >
        <option value="all">Todas com acesso gratuito</option>
        <option value="free">Gratuito no modo indicado</option>
        <option value="freemium">Plano gratuito com limites</option>
      </select>
    </label>
  );
}
export type PricingSelection = Tool["pricing"] | "all";
