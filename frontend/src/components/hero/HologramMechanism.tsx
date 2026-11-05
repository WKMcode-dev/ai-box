import { useSyncExternalStore } from "react";
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

export function HologramMechanism() {
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
                    fill={path.fill}
                    fillRule={path.fillRule as "evenodd" | "nonzero"}
                  />
                ))}
              </g>
            </g>
          </g>
        </g>
      ))}
      {/* Isometric core: its lid and side plates lift independently, without
        flipping the whole cube through the screen's vertical plane. */}
      <g
        className="holo-cube"
        transform="translate(119 25)"
        stroke="#b7ed98"
        strokeWidth=".7"
        strokeLinejoin="round"
      >
        <g className="holo-core-part" data-layer="cube-left">
          {!still && <Lift x={-4} y={-12} delay={0.45} />}
          <path d="M-23 -7 0 6V33L-23 20Z" fill="#29432ee6" />
          <path
            d="M-15 5-8 9V18L-15 14Z M-11 8v7 M-14 10l6 3"
            fill="none"
            strokeWidth=".8"
          />
        </g>
        <g className="holo-core-part" data-layer="cube-right">
          {!still && <Lift x={4} y={-21} delay={0.65} />}
          <path d="M0 6 23-7V20L0 33Z" fill="#192f23e6" />
          <text
            transform="translate(6 17) skewY(-29)"
            fill="#c5f7a9"
            stroke="none"
            fontSize="7"
            fontWeight="700"
          >
            A.I
          </text>
        </g>
        <g className="holo-core-part" data-layer="cube-lid">
          {!still && <Lift y={-44} delay={0.85} />}
          <path d="M0-20 23-7 0 6-23-7Z" fill="#6caa5866" />
          <path d="M0-14 13-7 0 0-13-7Z" fill="none" />
        </g>
      </g>
    </svg>
  );
}
