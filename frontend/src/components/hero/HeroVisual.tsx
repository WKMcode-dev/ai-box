import { Icon } from "../ui/Icon";
export function HeroVisual() {
  return (
    <div className="hero-visual">
      <div className="visual-orbit orbit-one" />
      <div className="visual-orbit orbit-two" />
      <div className="cube">
        <svg viewBox="0 0 260 260" aria-hidden="true">
          <defs>
            <linearGradient id="cube" x2="1" y2="1">
              <stop stopColor="#d8ffa2" />
              <stop offset="1" stopColor="#7cae42" />
            </linearGradient>
          </defs>
          <path d="m130 24 95 54v106l-95 54-95-54V78z" fill="url(#cube)" />
          <path
            d="m35 78 95 55 95-55M130 133v105M83 51l95 55v41"
            fill="none"
            stroke="#2a421e"
            strokeWidth="2"
          />
          <path d="m63 129 39 23v43l-39-23z" fill="#26391d" />
          <path d="m75 154 15 9 M82 151v16" stroke="#c9fc91" strokeWidth="2" />
        </svg>
      </div>
      <span className="floating float-one">
        <Icon name="image" /> Imaginação
      </span>
      <span className="floating float-two">
        <Icon name="code" /> Criação
      </span>
      <span className="floating float-three">
        <Icon name="audio" /> Inspiração
      </span>
      <span className="spark spark-one">✳</span>
      <span className="spark spark-two">+</span>
      <span className="visual-caption">ABRA A CAIXA. EXPANDA SUAS IDEIAS.</span>
    </div>
  );
}
