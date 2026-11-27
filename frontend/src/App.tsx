import {useRef,useState} from "react";
import type {Tool} from "@ai-box/contracts";
import {Sidebar} from "./components/layout/Sidebar";
import {Header} from "./components/layout/Header";
import {Footer} from "./components/layout/Footer";
import {Hero} from "./components/hero/Hero";
import {CatalogSection} from "./features/catalog/components/CatalogSection";
import {ToolModal} from "./features/catalog/components/ToolModal";
import {useCatalog} from "./features/catalog/hooks/useCatalog";
export default function App(){const catalog=useCatalog(),desktop=Boolean(window.desktopWindow),[selected,setSelected]=useState<Tool|null>(null),searchInput=useRef<HTMLInputElement>(null);function explore(){document.getElementById("catalogo")?.scrollIntoView({behavior:"smooth",block:"start"});searchInput.current?.focus({preventScroll:true})}return <><Sidebar desktop={desktop} counts={catalog.counts} category={catalog.category} setCategory={catalog.setCategory}/><div className="shell"><Header explore={explore} setCategory={catalog.setCategory}/><main><Hero desktop={desktop} tools={catalog.tools} count={catalog.counts.ai} securityCount={catalog.counts.security} loading={catalog.loading} explore={explore}/><CatalogSection catalog={catalog} searchRef={searchInput} onSelect={setSelected}/><Footer desktop={desktop}/></main></div>{selected&&<ToolModal tool={selected} onClose={()=>setSelected(null)}/>}</>}