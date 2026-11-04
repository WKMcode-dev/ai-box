import { Icon } from "../ui/Icon";
import { HeroVisual } from "./HeroVisual";
export function Hero({ explore }: { explore: () => void }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">
          <span className="online-dot" /> UM MUNDO DE POSSIBILIDADES
        </span>
        <h1>
          Sua próxima grande ideia
          <br />
          começa <em>aqui.</em>
        </h1>
        <p>
          IAs com acesso gratuito para o que você imagina.
          <br className="desktop-break" /> Explore, descubra e encontre seu
          próximo superpoder.
        </p>
        <button className="primary" onClick={explore}>
          Encontrar minha IA <Icon name="arrow" size={18} />
        </button>
        <div className="hero-note">
          <span>↳</span> Sem cadastro na BOX. Explore ferramentas com acesso
          gratuito.
        </div>
      </div>
      <HeroVisual />
    </section>
  );
}
