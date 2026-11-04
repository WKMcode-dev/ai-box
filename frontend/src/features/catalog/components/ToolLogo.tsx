import { assetUrl } from "../../../utils/assetUrl";
import { useState } from "react";
import type { Tool } from "@ai-box/contracts";
interface Props {
  tool: Tool;
}
export function ToolLogo({ tool }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="tool-logo">
      {tool.logoKind === "text" || !tool.logo || failed ? (
        <div className="project-name">
          <span>{tool.name}</span>
          <small>{tool.maker}</small>
        </div>
      ) : (
        <img
          src={assetUrl(tool.logo)}
          alt={`Logo de ${tool.logoLabel}`}
          onError={() => setFailed(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}
