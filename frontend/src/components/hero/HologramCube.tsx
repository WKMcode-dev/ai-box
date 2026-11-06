import { useEffect, useState } from "react";
import type { Tool } from "@ai-box/contracts";
import { assetUrl } from "../../utils/assetUrl";
import { cubeFaces } from "./cubeGeometry";

export function HologramCube({
  still,
  tools,
}: {
  still: boolean;
  tools: Tool[];
}) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (still) return;
    let frame = 0,
      last = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (now - last >= 32) {
        setElapsed(now - start);
        last = now;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [still]);
  const time = still ? 0 : elapsed;
  const logos = tools.filter((tool) => tool.logoKind === "brand" && tool.logo);
  const turn = Math.PI / 4 + (time / 24000) * Math.PI * 2;
  const cycle = Math.floor(time / 4800);
  // Fade out and back in when exchanging catalogue logos.
  const phase = (time % 4800) / 4800;
  const opacity = still ? 1 : Math.min(1, phase * 10, (1 - phase) * 10);
  return (
    <g
      className="holo-cube"
      transform="translate(119 19)"
      data-turn={turn}
      data-icon-cycle={cycle}
    >
      {cubeFaces(turn).map((face) => {
        const tool = logos.length
          ? logos[(cycle * 4 + face.index) % logos.length]
          : undefined;
        return (
          <g className="holo-cube-face" key={face.index} data-face={face.index}>
            <polygon
              points={face.points}
              fill={face.index === 4 ? "#294b36" : "#13291d"}
              stroke="currentColor"
              strokeWidth=".65"
              strokeLinejoin="round"
            />
            <g transform={face.matrix}>
              <rect
                x="4"
                y="4"
                width="38"
                height="38"
                rx="3"
                fill="none"
                stroke="currentColor"
                strokeOpacity=".2"
                strokeWidth=".4"
              />
              {tool ? (
                <image
                  className="holo-cube-icon"
                  href={assetUrl(tool.logo!)}
                  x="10"
                  y="10"
                  width="26"
                  height="26"
                  preserveAspectRatio="xMidYMid meet"
                  opacity={opacity}
                  data-tool-id={tool.id}
                />
              ) : (
                <text
                  x="23"
                  y="26"
                  textAnchor="middle"
                  fontSize="9"
                  fill="currentColor"
                >
                  A.I
                </text>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
}
