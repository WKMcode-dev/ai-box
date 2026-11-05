import { pricingLabels } from "../config/pricing";
import type { Tool } from "@ai-box/contracts";
import { Icon } from "../../../components/ui/Icon";
import { ToolLogo } from "./ToolLogo";
interface Props { tool: Tool; onSelect: (tool: Tool) => void; }
export function ToolCard({ tool, onSelect }: Props) {
  return <button className={`card shift-card ${tool.color}`} onClick={() => onSelect(tool)} aria-label={`Conhecer ${tool.name}`}>
    <span className="shift-shape" aria-hidden="true" />
    <span className="shift-logo"><ToolLogo tool={tool}/></span>
    <span className="shift-content">
      <span className="shift-heading"><strong title={tool.name}>{tool.name}</strong><span className="shift-pricing">{tool.pricing === "free" ? "Grátis" : "Freemium"}</span></span>
      <span className="shift-maker">{tool.maker}</span>
      <span className="shift-description">{tool.description}</span>
    </span>
    <span className="shift-category"><Icon name="grid" size={13}/>{tool.category}</span>
    <span className="shift-tags">{tool.tags.slice(0, 3).map(t => <span key={t} title={t}>{t}</span>)}</span>
    <span className="sr-only">{pricingLabels[tool.pricing]}</span>
  </button>;
}