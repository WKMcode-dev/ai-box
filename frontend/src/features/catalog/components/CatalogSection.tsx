import type {RefObject} from "react";
import type {Tool} from "@ai-box/contracts";
import {SECURITY_SUBCATEGORIES} from "@ai-box/contracts";
import {Icon} from "../../../components/ui/Icon";
import {useCatalog} from "../hooks/useCatalog";
import {CatalogFilters} from "./CatalogFilters";
import {CatalogState} from "./CatalogState";
import {ToolCard} from "./ToolCard";
import {PricingFilter} from "./PricingFilter";
import {AccessFilter} from "./AccessFilter";

type Catalog=ReturnType<typeof useCatalog>;
interface Props{catalog:Catalog;searchRef:RefObject<HTMLInputElement|null>;onSelect:(tool:Tool)=>void}

export function CatalogSection({catalog,searchRef,onSelect}:Props){
 const {counts,results,loading,error,retry,category,securitySubcategory,setSecuritySubcategory,clearFilters,query,setQuery}=catalog;
 const security=category==="Cibersegurança";
 return <section id="catalogo" className="catalog" aria-busy={loading}>
  <div className="section-heading"><div><span className="eyebrow">{security?"AI BOX / SECURITY LAB":"EXPLORE A BOX"}</span><h2>{security?"Laboratório de Cibersegurança":"Catálogo de ferramentas"}<span>.</span></h2></div><span className="catalog-total">{loading?"…":security?counts.security:counts.ai} {security?"ferramentas de segurança":"IAs disponíveis"} <Icon name={security?"shield":"box"} size={17}/></span></div>
  <div className="search-row">
   <label className="search" htmlFor="catalog-search"><Icon name="search" size={18}/><input id="catalog-search" ref={searchRef} type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar IAs e ferramentas..." autoComplete="off" aria-label="Pesquisar IAs e ferramentas"/>{query&&<button type="button" aria-label="Limpar pesquisa" onClick={()=>setQuery("")}><Icon name="close" size={16}/></button>}<kbd>BUSCA</kbd></label>
  </div>
  <CatalogFilters category={catalog.category} setCategory={catalog.setCategory} sort={catalog.sort} setSort={catalog.setSort}/>
  {security&&<div className="security-filter"><label htmlFor="security-area">FILTRAR POR ÁREA</label><select id="security-area" value={securitySubcategory} onChange={e=>setSecuritySubcategory(e.target.value)}><option value="Todas as áreas">Todas as áreas</option>{SECURITY_SUBCATEGORIES.map(s=><option key={s} value={s}>{s}</option>)}</select><span>{results.length} resultados</span></div>}
  <PricingFilter pricing={catalog.pricing} setPricing={catalog.setPricing}/><AccessFilter access={catalog.access} setAccess={catalog.setAccess}/>
  <div className="results-line"><span>{security?"Cibersegurança":"Catálogo de IAs"} <span className="result-count">{results.length}</span></span><span>{query?<>Resultados para “{query}”</>:security?"Explore por área de atuação":"Explore as ferramentas disponíveis"}</span></div>
  {loading?<CatalogState title="Abrindo a BOX…"/>:error?<CatalogState title={error} action={retry} actionLabel="Tentar novamente"/>:results.length?(security?<div className="security-groups">{SECURITY_SUBCATEGORIES.map(s=>{const items=results.filter(t=>t.subcategory===s);if(!items.length)return null;return <section className="security-group" key={s} aria-label={s}><div className="security-group-heading"><div><span className="security-group-kicker">ÁREA DE ATUAÇÃO</span><h3>{s}</h3></div><span className="security-group-count">{items.length} {items.length===1?"ferramenta":"ferramentas"}</span></div><div className="cards">{items.map(t=><ToolCard key={t.id} tool={t} onSelect={onSelect}/>)}</div></section>})}</div>:<div className="cards">{results.map(t=><ToolCard key={t.id} tool={t} onSelect={onSelect}/>)}</div>):<CatalogState title={query?"Nenhum resultado encontrado.":security?"Nenhuma ferramenta encontrada nesta área.":"Nenhuma IA encontrada por aqui."} description="Experimente outro termo ou ajuste os filtros." action={clearFilters} actionLabel="Limpar pesquisa e filtros"/>}
 </section>
}