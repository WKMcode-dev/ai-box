import type { RefObject } from "react";
import { Icon } from "../../../components/ui/Icon";
import { categories } from "../config/categories";
interface Props {
  query: string;
  setQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
}
export function CatalogFilters({
  query,
  setQuery,
  category,
  setCategory,
  sort,
  setSort,
  searchRef,
}: Props) {
  return (
    <>
      <div className="search-row">
        <label className="search">
          <Icon name="search" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que você quer criar hoje?"
            aria-label="Buscar inteligências artificiais"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Limpar busca">
              <Icon name="close" size={16} />
            </button>
          )}
          <kbd>BUSCAR</kbd>
        </label>
        <label className="sort">
          <span>Ordenar por</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Ordenar ferramentas"
          >
            <option value="featured">Destaques</option>
            <option value="az">Nome: A–Z</option>
          </select>
        </label>
      </div>
      <div className="chips" aria-label="Filtrar por categoria">
        {categories.map((c) => (
          <button
            className={category === c ? "chip selected" : "chip"}
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
          >
            {c === "Todas as IAs" ? "Todas" : c}
          </button>
        ))}
      </div>
    </>
  );
}
