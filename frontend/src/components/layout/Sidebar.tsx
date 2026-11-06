import type { Tool } from "@ai-box/contracts";
import { categories } from "../../features/catalog/config/categories";
import { Icon } from "../ui/Icon";
interface Props {
  desktop?: boolean;
  catalog: Tool[];
  category: string;
  setCategory: (value: string) => void;
}
export function Sidebar({
  catalog,
  category,
  setCategory,
  desktop = false,
}: Props) {
  return (
    <aside className="sidebar">
      {!desktop && (
        <a className="brand" href="#" aria-label="A.I BOX início">
          <span className="brand-icon">
            <Icon name="box" size={27} />
          </span>
          A.I BOX<span className="beta">BETA</span>
        </a>
      )}
      <div className="sidebar-label">SEU UNIVERSO DE IA</div>
      <nav aria-label="Categorias">
        {categories.map((c, i) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={category === c ? "nav-item active" : "nav-item"}
          >
            <Icon
              name={
                [
                  "grid",
                  "text",
                  "image",
                  "video",
                  "audio",
                  "code",
                  "work",
                  "research",
                ][i]
              }
            />
            <span>{c}</span>
            <span className="count">
              {i === 0
                ? catalog.length
                : catalog.filter((t) => t.category === c).length}
            </span>
          </button>
        ))}
      </nav>
      {!desktop && (
        <div className="sidebar-bottom">
          <div className="mini-spark">✳</div>
          <strong>
            Grandes ideias.
            <br />
            Novas possibilidades.
          </strong>
          <p>Sua próxima criação começa com a ferramenta certa.</p>
          <span className="online-dot" /> Livre para explorar
        </div>
      )}
      <div className="sidebar-footer">
        Feito para mentes curiosas <span>↗</span>
      </div>
    </aside>
  );
}
