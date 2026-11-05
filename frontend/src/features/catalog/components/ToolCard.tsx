import { pricingLabels } from "../config/pricing";
import type { Tool } from "@ai-box/contracts";
import { Icon } from "../../../components/ui/Icon";
import { ToolLogo } from "./ToolLogo";
import { useId } from "react";
interface Props {
  tool: Tool;
  onSelect: (tool: Tool) => void;
}
export function ToolCard({ tool, onSelect }: Props) {
  const glassId = useId();
  return (
    <button
      type="button"
      className={`shift-card ${tool.color}`}
      onClick={() => onSelect(tool)}
      aria-label={`Conhecer ${tool.name}`}
    >
      <svg
        className="shift-vector"
        viewBox="-229 -181 114 42"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#28382f" />
            <stop offset=".55" stopColor="#141d18" />
            <stop offset="1" stopColor="#1c2b22" />
          </linearGradient>
        </defs>
        <g fill={`url(#${glassId})`}>
          <path
            className="shift-outline"
            d="M -218 -160 A 10 10 0 0 0 -208 -170 L -208 -177 A 3 3 0 0 1 -205 -180 L -119 -180 A 3 3 0 0 1 -116 -177 L -116 -151 A 3 3 0 0 1 -119 -148 L -176.5 -148 A 3 3 0 0 0 -178.9 -146.8 L -183.1 -141.2 A 3 3 0 0 1 -185.5 -140 L -225 -140 A 3 3 0 0 1 -228 -143 L -228 -157 A 3 3 0 0 1 -225 -160 Z"
          />
          <path
            className="shift-circle-outline"
            d="M -219 -180 A 9 9 0 0 1 -210 -171 A 9 9 0 0 1 -219 -162 A 9 9 0 0 1 -228 -171 A 9 9 0 0 1 -219 -180 Z"
          />
        </g>
      </svg>
      <span className="shift-logo">
        <ToolLogo tool={tool} />
      </span>
      <span className="shift-content">
        <span className="shift-heading">
          <strong title={tool.name}>{tool.name}</strong>
          <span className="shift-pricing">
            {tool.pricing === "free" ? "Grátis" : "Freemium"}
          </span>
        </span>
        <span className="shift-maker">{tool.maker}</span>
        <span className="shift-description">{tool.description}</span>
      </span>
      <span className="shift-category">
        <Icon name="grid" size={13} />
        {tool.category}
      </span>
      <span className="shift-tags">
        {tool.tags.slice(0, 3).map((t) => (
          <span key={t} title={t}>
            {t}
          </span>
        ))}
      </span>
      <span className="sr-only">{pricingLabels[tool.pricing]}</span>
    </button>
  );
}
