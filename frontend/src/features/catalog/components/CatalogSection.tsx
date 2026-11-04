import { PricingFilter } from "./PricingFilter";
import { AccessFilter } from "./AccessFilter";
import type { RefObject } from "react";
import type { Tool } from "@ai-box/contracts";
import { Icon } from "../../../components/ui/Icon";
import { useCatalog } from "../hooks/useCatalog";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogState } from "./CatalogState";
import { ToolCard } from "./ToolCard";
type Catalog = ReturnType<typeof useCatalog>;
interface Props {
  catalog: Catalog;
  searchRef: RefObject<HTMLInputElement | null>;
  onSelect: (tool: Tool) => void;
}
export function CatalogSection({ catalog, searchRef, onSelect }: Props) {
  const {
    tools,
    results,
    loading,
    error,
    retry,
    category,
    query,
    clearFilters,
  } = catalog;
  return (
    <section id="catalogo" className="catalog" aria-busy={loading}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">EXPLORE A BOX</span>
          <h2>
            Uma IA para cada ideia<span>.</span>
          </h2>
        </div>
        <span className="catalog-total">
          {tools.length} ferramentas para descobrir{" "}
          <Icon name="box" size={17} />
        </span>
      </div>
      <CatalogFilters {...catalog} searchRef={searchRef} />
      <PricingFilter
        pricing={catalog.pricing}
        setPricing={catalog.setPricing}
      />
      <AccessFilter access={catalog.access} setAccess={catalog.setAccess} />
      <div className="results-line">
        <span>
          {category === "Todas as IAs" ? "Todas as ferramentas" : category}{" "}
          <span className="result-count">{results.length}</span>
        </span>
        <span aria-live="polite">
          {query
            ? `Resultados para “${query}”`
            : "Encontre seu próximo favorito"}
        </span>
      </div>
      {loading ? (
        <CatalogState title="Abrindo a BOX…" />
      ) : error ? (
        <CatalogState
          title={error}
          action={retry}
          actionLabel="Tentar novamente"
        />
      ) : results.length ? (
        <div className="cards">
          {results.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <CatalogState
          title="Nenhuma IA encontrada por aqui."
          description="Experimente outra palavra ou explore todas as categorias."
          action={clearFilters}
          actionLabel="Limpar filtros"
        />
      )}
    </section>
  );
}
