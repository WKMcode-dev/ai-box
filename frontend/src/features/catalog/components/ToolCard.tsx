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
  const edgeId = useId();
  const logoEdgeId = useId();
  const glowId = useId();
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
            <stop stopColor="#373b39" />
            <stop offset=".45" stopColor="#202421" />
            <stop offset="1" stopColor="#141715" />
          </linearGradient>
          <radialGradient id={edgeId} cx="0" cy="1" r=".85">
            <stop stopColor="#76ffad" />
            <stop offset=".22" stopColor="#55e897" />
            <stop offset=".42" stopColor="#a4ada7" />
            <stop offset=".72" stopColor="#6c746f" />
            <stop offset="1" stopColor="#b9bfbb" />
          </radialGradient>
          <linearGradient id={logoEdgeId} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#7bffb2" />
            <stop offset=".25" stopColor="#61f49c" />
            <stop offset=".48" stopColor="#747e77" />
            <stop offset=".7" stopColor="#67f4a2" />
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
            {/* Isolate green highlights so the silver border stays sharp. */}
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 .35  0 0 0 0 1  0 0 0 0 .6  -3 6 -3 0 -.25"
            />
            <feGaussianBlur stdDeviation=".45" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g
          filter={`url(#${glowId})`}
          fill={`url(#${glassId})`}
          fillRule="evenodd"
          strokeWidth="0.5"
          strokeLinejoin="miter"
          strokeMiterlimit="20"
        >
          <path
            className="shift-outline"
            stroke={`url(#${edgeId})`}
            d="M -218 -160 A 10 10 0 0 0 -208 -170 L -208 -177 A 3 3 0 0 1 -205 -180 L -119 -180 A 3 3 0 0 1 -116 -177 L -116 -151 A 3 3 0 0 1 -119 -148 L -176.5 -148 A 3 3 0 0 0 -178.9 -146.8 L -183.1 -141.2 A 3 3 0 0 1 -185.5 -140 L -225 -140 A 3 3 0 0 1 -228 -143 L -228 -157 A 3 3 0 0 1 -225 -160 Z"
          />
          <path
            className="shift-circle-outline"
            stroke={`url(#${logoEdgeId})`}
            d="M -219 -180 A 9 9 0 0 1 -210 -171 A 9 9 0 0 1 -219 -162 A 9 9 0 0 1 -228 -171 A 9 9 0 0 1 -219 -180 Z"
          />
          <path
            className="shift-pill"
            d="M -156 -142.5 A 2.5 2.5 0 0 1 -153.5 -145 L -140.5 -145 A 2.5 2.5 0 0 1 -138 -142.5 L -138 -142.5 A 2.5 2.5 0 0 1 -140.5 -140 L -153.5 -140 A 2.5 2.5 0 0 1 -156 -142.5 Z"
          />
          <path
            className="shift-pill"
            d="M -134 -142.5 A 2.5 2.5 0 0 1 -131.5 -145 L -118.5 -145 A 2.5 2.5 0 0 1 -116 -142.5 L -116 -142.5 A 2.5 2.5 0 0 1 -118.5 -140 L -131.5 -140 A 2.5 2.5 0 0 1 -134 -142.5 Z"
          />
          <path
            className="shift-pill"
            d="M -178 -142.5 A 2.5 2.5 0 0 1 -175.5 -145 L -162.5 -145 A 2.5 2.5 0 0 1 -160 -142.5 L -160 -142.5 A 2.5 2.5 0 0 1 -162.5 -140 L -175.5 -140 A 2.5 2.5 0 0 1 -178 -142.5 Z"
          />
          <path
            className="shift-pill shift-pricing-outline"
            d="M -131.75 -175.5 A 2.5 2.5 0 0 1 -129.25 -178 L -120.75 -178 A 2.5 2.5 0 0 1 -118.25 -175.5 L -118.25 -175.5 A 2.5 2.5 0 0 1 -120.75 -173 L -129.25 -173 A 2.5 2.5 0 0 1 -131.75 -175.5 Z"
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
