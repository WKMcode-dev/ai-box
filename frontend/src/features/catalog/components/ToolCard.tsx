import { pricingLabels } from "../config/pricing";
import type { Tool } from "@ai-box/contracts";
import { Icon } from "../../../components/ui/Icon";
import { ToolLogo } from "./ToolLogo";
import { useId } from "react";
import { shiftCardLayout } from "../utils/shiftCardLayout";
interface Props {
  tool: Tool;
  onSelect: (tool: Tool) => void;
}
export function ToolCard({ tool, onSelect }: Props) {
  const glassId = useId();
  const edgeId = useId();
  const logoEdgeId = useId();
  const glowId = useId();
  const bodyId = useId();
  const circleId = useId();
  const layout = shiftCardLayout(tool.tags);
  return (
    <button
      type="button"
      className={`shift-card ${tool.color}`}
      style={{ aspectRatio: `114 / ${layout.height}` }}
      data-tag-count={layout.tags.length}
      onClick={() => onSelect(tool)}
      aria-label={`Conhecer ${tool.name}`}
    >
      <svg
        className="shift-vector"
        viewBox={`-229 -181 114 ${layout.height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#373b39" />
            <stop offset=".45" stopColor="#202421" />
            <stop offset="1" stopColor="#141715" />
          </linearGradient>
          <radialGradient id={edgeId} cx="0" cy="1" r=".85">
            <stop stopColor="var(--accent)" />
            <stop offset=".22" stopColor="var(--accent)" />
            <stop offset=".42" stopColor="#a4ada7" />
            <stop offset=".72" stopColor="#6c746f" />
            <stop offset="1" stopColor="#b9bfbb" />
          </radialGradient>
          <linearGradient id={logoEdgeId} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--accent)" />
            <stop offset=".25" stopColor="var(--accent)" />
            <stop offset=".48" stopColor="#747e77" />
            <stop offset=".7" stopColor="var(--accent)" />
            <stop offset="1" stopColor="#8e9991" />
          </linearGradient>
          <filter
            id={glowId}
            x="-15%"
            y="-35%"
            width="130%"
            height="170%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation=".5" />
          </filter>
        </defs>
        <g
          className="shift-glow"
          filter={`url(#${glowId})`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth=".45"
        >
          <use href={`#${bodyId}`} />
          <use href={`#${circleId}`} />
        </g>
        <g
          fill={`url(#${glassId})`}
          fillRule="evenodd"
          strokeWidth="0.32"
          strokeLinejoin="miter"
          strokeMiterlimit="20"
        >
          <path
            id={bodyId}
            className="shift-outline"
            stroke={`url(#${edgeId})`}
            d={layout.body}
          />
          <path
            id={circleId}
            className="shift-circle-outline"
            stroke={`url(#${logoEdgeId})`}
            d="M -219 -180 A 9 9 0 0 1 -210 -171 A 9 9 0 0 1 -219 -162 A 9 9 0 0 1 -228 -171 A 9 9 0 0 1 -219 -180 Z"
          />
          {layout.tags.map((tag, index) => (
            <path
              key={index}
              className="shift-pill shift-tag-outline"
              d={tag.path}
            />
          ))}
          <path
            className="shift-pill shift-pricing-outline"
            d="M -131.75 -175.5 A 2.5 2.5 0 0 1 -129.25 -178 L -120.75 -178 A 2.5 2.5 0 0 1 -118.25 -175.5 L -118.25 -175.5 A 2.5 2.5 0 0 1 -120.75 -173 L -129.25 -173 A 2.5 2.5 0 0 1 -131.75 -175.5 Z"
          />
          <rect
            className="shift-category-outline"
            x="-225.01"
            y="-150.55"
            width="35.34"
            height="8.4"
            rx="2.28"
          />
        </g>
      </svg>
      <span className="shift-logo">
        <ToolLogo tool={tool} />
      </span>
      <span className="shift-pricing">
        <Icon name={tool.pricing === "free" ? "star" : "crown"} size={10} />
        <span>{tool.pricing === "free" ? "Grátis" : "Freemium"}</span>
      </span>
      <span className="shift-content">
        <span className="shift-heading">
          <strong title={tool.name}>{tool.name}</strong>
        </span>
        <span className="shift-maker">{tool.maker}</span>
        <span className="shift-description">{tool.description}</span>
      </span>
      <span className="shift-category" title={tool.category}>
        <Icon
          name={
            tool.category === "Texto"
              ? "bot"
              : {
                  Imagem: "image",
                  Vídeo: "video",
                  Áudio: "audio",
                  Código: "code",
                  Produtividade: "work",
                  Pesquisa: "research",
                }[tool.category] || "grid"
          }
          size={13}
        />
        <span>
          {tool.category === "Texto" ? "Texto e Chat" : tool.category}
        </span>
      </span>
      <span className="shift-tags">
        {layout.tags.map((tag, index) => (
          <span
            key={index}
            title={tag.label}
            style={{
              left: `${((tag.x + 229) / 114) * 100}%`,
              top: `${((tag.y + 181) / 114) * 100}cqi`,
            }}
          >
            {tag.label}
          </span>
        ))}
      </span>
      <span className="sr-only">{pricingLabels[tool.pricing]}</span>
    </button>
  );
}
