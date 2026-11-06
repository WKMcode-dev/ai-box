import { useRef, useState } from "react";
import type { Tool } from "@ai-box/contracts";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/hero/Hero";
import { CatalogSection } from "./features/catalog/components/CatalogSection";
import { ToolModal } from "./features/catalog/components/ToolModal";
import { useCatalog } from "./features/catalog/hooks/useCatalog";
import { UpdateNotice } from "./features/updates/UpdateNotice";
export default function App() {
  const catalog = useCatalog();
  const [selected, setSelected] = useState<Tool | null>(null);
  const search = useRef<HTMLInputElement>(null);
  function explore() {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    search.current?.focus({ preventScroll: true });
  }
  return (
    <>
      <Sidebar
        catalog={catalog.tools}
        category={catalog.category}
        setCategory={catalog.setCategory}
      />
      <div className="shell">
        <Header explore={explore} />
        <main>
          <Hero
            tools={catalog.tools}
            count={catalog.tools.length}
            loading={catalog.loading}
            explore={explore}
          />
          <CatalogSection
            catalog={catalog}
            searchRef={search}
            onSelect={setSelected}
          />
          <Footer />
          <UpdateNotice />
        </main>
      </div>
      {selected && (
        <ToolModal tool={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
