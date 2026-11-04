import { pricingLabels } from "../config/pricing";
import { accessLabels } from "../config/accessModes";
import type { Tool } from "@ai-box/contracts";
import { Icon } from "../../../components/ui/Icon";
import { ToolLogo } from "./ToolLogo";
interface Props {
  tool: Tool;
  onSelect: (tool: Tool) => void;
}
export function ToolCard({ tool, onSelect }: Props) {
  return (
    <button
      className="card"
      onClick={() => onSelect(tool)}
      aria-label={`Conhecer ${tool.name}`}
    >
      <div className={`card-art ${tool.color}`}>
        <ToolLogo tool={tool} />
        <span className="category-tag">{tool.category}</span>
        {tool.featured && (
          <span className="featured" title="Seleção editorial">
            <Icon name="star" size={13} /> Em destaque
          </span>
        )}
        <span className="art-label">{tool.maker.toUpperCase()}</span>
      </div>
      <div className="card-body">
        <div className="card-title">
          <h3>{tool.name}</h3>
          <span className="card-arrow">
            <Icon name="arrow" size={17} />
          </span>
        </div>
        <div className="tool-meta">
          <span>
            {pricingLabels[tool.pricing]} · {accessLabels[tool.access]}
          </span>
          <span>{tool.kind}</span>
        </div>
        <p>{tool.description}</p>
        <div className="tags">
          {tool.tags.slice(0, 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </button>
  );
}
