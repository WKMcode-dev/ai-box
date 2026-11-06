import { useSyncExternalStore } from "react";
import type { Tool } from "@ai-box/contracts";
import { HologramCube } from "./HologramCube";
import layers from "./data/group45Layers.json";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const reducedMotion = () => window.matchMedia(motionQuery).matches;

function Lift({
  x = 0,
  y,
  delay = 0,
}: {
  x?: number;
  y: number;
  delay?: number;
}) {
  return (
    <animateTransform
      attributeName="transform"
      type="translate"
      values={`0 0;0 0;${x} ${y};${x} ${y};0 0;0 0`}
      keyTimes="0;.12;.3;.65;.88;1"
      calcMode="spline"
      keySplines=".4 0 .2 1;.4 0 .2 1;.4 0 .2 1;.4 0 .2 1;.4 0 .2 1"
      begin={`${delay}s`}
      dur="14s"
      repeatCount="indefinite"
    />
  );
}

export function HologramMechanism({ tools }: { tools: Tool[] }) {
  const still = useSyncExternalStore(
    subscribeMotion,
    reducedMotion,
    () => true,
  );
  return (
    <svg
      className="holo-mechanism"
      viewBox="-65 -105 368 250"
      width="368"
      height="250"
      aria-hidden="true"
      data-motion={still ? "reduced" : "animated"}
    >
      {/* Original Group 45 paths, separated into mechanical assemblies. */}
      {layers.map((layer) => (
        <g key={layer.name} className="holo-part" data-layer={layer.name}>
          {!still && layer.lift !== 0 && (
            <Lift y={layer.lift} delay={layer.delay} />
          )}
          {/* Unproject, turn around the vertical axis, then project back to the
          same horizontal plane. The ellipse never tumbles on screen. */}
          <g transform={`translate(119 ${layer.centerY}) scale(1 .32)`}>
            <g className="holo-rotor">
              {!still && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to={`${360 * layer.direction} 0 0`}
                  dur={`${layer.duration}s`}
                  repeatCount="indefinite"
                />
              )}
              <g transform={`scale(1 3.125) translate(-119 ${-layer.centerY})`}>
                {layer.paths.map((path, index) => (
                  <path
                    key={index}
                    d={path.d}
                    fill="currentColor"
                    opacity={path.fill.toLowerCase() === "#163c5b" ? 0.3 : 1}
                    fillRule={path.fillRule as "evenodd" | "nonzero"}
                  />
                ))}
              </g>
            </g>
          </g>
        </g>
      ))}
      <HologramCube still={still} tools={tools} />
    </svg>
  );
}
