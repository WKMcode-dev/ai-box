import { Icon } from "../ui/Icon";
export function Footer({ desktop = false }: { desktop?: boolean }) {
  return (
    <>
      <section className="closing">
        <Icon name="box" size={27} />
        <p>
          A ferramenta é só o começo. <strong>A ideia é sua.</strong>
        </p>
        <span>Encontre seu próximo projeto ↗</span>
      </section>
      <footer>
        {!desktop && (
          <a className="footer-brand" href="#">
            A.I BOX
          </a>
        )}
        <span>Um universo de IA. Aberto para você.</span>
        <small>Catálogo independente · 2026</small>
      </footer>
    </>
  );
}
