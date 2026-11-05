import { assetUrl } from "../../utils/assetUrl";
import { Icon } from "../ui/Icon";
export function HeroVisual() {
  return (
    <div
      className="holo-stage"
      role="img"
      aria-label="Holograma da caixa A.I BOX com anéis luminosos em rotação"
    >
      <div className="holo-halo" />
      <img
        className="holo-ring holo-ring-back"
        src={assetUrl("/hologram/group-45.svg")}
        alt=""
        aria-hidden="true"
      />
      <div className="holo-cube">
        <div className="holo-cube-face holo-front">
          <Icon name="box" size={62} />
          <span>A.I</span>
        </div>
        <div className="holo-cube-face holo-right">
          <Icon name="code" size={55} />
        </div>
        <div className="holo-cube-face holo-top">
          <Icon name="image" size={48} />
        </div>
      </div>
      <img
        className="holo-ring holo-ring-front"
        src={assetUrl("/hologram/group-45.svg")}
        alt=""
        aria-hidden="true"
      />
      <div className="holo-ground" />
      <span className="holo-caption">INTELIGÊNCIAS CONECTADAS</span>
    </div>
  );
}
