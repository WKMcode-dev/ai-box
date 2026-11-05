import { HologramMechanism } from "./HologramMechanism";
export function HeroVisual() {
  return (
    <div
      className="holo-stage"
      role="img"
      aria-label="Holograma A.I BOX: anéis giram no plano horizontal e as peças sobem em sequência, abrindo o mecanismo"
    >
      <HologramMechanism />
      <div className="holo-ground" />
      <span className="holo-caption">INTELIGÊNCIAS CONECTADAS</span>
    </div>
  );
}
