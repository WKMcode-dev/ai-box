import { Icon } from "../ui/Icon";
export function Header({ explore }: { explore: () => void }) {
  return (
    <header className="topbar">
      <span>Descubra. Experimente. Crie.</span>
      <a
        href="#catalogo"
        onClick={(e) => {
          e.preventDefault();
          explore();
        }}
      >
        Explorar catálogo <Icon name="arrow" size={16} />
      </a>
    </header>
  );
}
