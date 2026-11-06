import type { Tool } from "@ai-box/contracts";
import { HeroVisual } from "./HeroVisual";
import { Icon } from "../ui/Icon";
export function Hero({
  desktop = false,
  tools,
  count,
  loading,
  explore,
}: {
  desktop?: boolean;
  tools: Tool[];
  count: number;
  loading: boolean;
  explore: () => void;
}) {
  return (
    <section className="hero-dashboard" aria-label="Visão geral do A.I BOX">
      <div className="hologram-panel">
        <HeroVisual tools={tools} />
      </div>
      <div className="hero-counter glass-panel">
        <span className="counter-kicker">
          CATÁLOGO A.I BOX <span className="online-dot" />
        </span>
        {!desktop && (
          <div className="counter-brand">
            <Icon name="box" size={26} />
            <strong>A.I BOX</strong>
            <span className="beta">BETA</span>
          </div>
        )}
        <div className="counter-stat">
          <span className="counter-number" aria-live="polite">
            {loading ? "…" : count.toLocaleString("pt-BR")}
          </span>
          <div>
            <strong>Ferramentas</strong>
            <small>disponíveis no catálogo</small>
          </div>
        </div>
        <div className="counter-track" aria-hidden="true">
          <span />
        </div>
        <p>
          Encontre IAs para texto, imagem, vídeo, áudio, programação e muito
          mais.
        </p>
        <button className="counter-action" onClick={explore}>
          Explorar catálogo <Icon name="arrow" size={17} />
        </button>
      </div>
    </section>
  );
}
