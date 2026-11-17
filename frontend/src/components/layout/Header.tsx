import { useState } from "react";
import { categories } from "../../features/catalog/config/categories";
import { assetUrl } from "../../utils/assetUrl";
import { Icon } from "../ui/Icon";
import { UpdateNotice } from "../../features/updates/UpdateNotice";
export type DesktopWindow = { minimize:()=>void; maximize:()=>void; close:()=>void };
declare global { interface Window { desktopWindow?: DesktopWindow } }
export function Header({explore,setCategory}:{explore:()=>void;setCategory:(v:string)=>void}) {
 const desktop=window.desktopWindow,[open,setOpen]=useState(false);
 function choose(value:string){setCategory(value);setOpen(false);explore()}
 return <header className={desktop?"topbar desktop-titlebar":"topbar"}>
  <div className="titlebar-brand"><span className="titlebar-logo"><img src={assetUrl("favicon.svg")} width="31" height="31" alt=""/></span><strong>A.I BOX</strong>{!desktop&&<span className="beta">BETA</span>}</div>
  <nav className="titlebar-nav" aria-label="Navegação principal"><a href="#catalogo" onClick={e=>{e.preventDefault();setOpen(false);explore()}}><Icon name="grid" size={16}/><span>Catálogo</span></a>{desktop&&<UpdateNotice compact/>}</nav>
  <button type="button" className="mobile-menu-button" aria-label={open?"Fechar menu":"Abrir menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(v=>!v)}><Icon name={open?"close":"menu"} size={20}/></button>
  {open&&<div className="mobile-menu-panel" id="mobile-navigation"><div className="mobile-menu-heading">NAVEGAR</div><button className="mobile-menu-link" onClick={()=>choose("Todas as IAs")}><Icon name="grid" size={17}/>Todas as IAs</button>{categories.filter(c=>c!=="Todas as IAs").map(c=><button className="mobile-menu-link" key={c} onClick={()=>choose(c)}><Icon name={c==="Texto"?"text":c==="Imagem"?"image":c==="Vídeo"?"video":c==="Áudio"?"audio":c==="Código"?"code":c==="Produtividade"?"work":"research"} size={17}/>{c}</button>)}<div className="mobile-menu-divider"/><div className="mobile-menu-heading security-menu-heading">LABORATÓRIO DE SEGURANÇA</div><button className="mobile-menu-link security-menu-link" onClick={()=>choose("Cibersegurança")}><Icon name="shield" size={17}/>Cibersegurança</button></div>}
  {desktop&&<div className="window-controls" aria-label="Controles da janela"><button type="button" aria-label="Minimizar janela" onClick={()=>desktop.minimize()}><Icon name="minimize" size={16}/></button><button type="button" aria-label="Maximizar ou restaurar janela" onClick={()=>desktop.maximize()}><Icon name="maximize" size={14}/></button><button type="button" className="window-close" aria-label="Fechar janela" onClick={()=>desktop.close()}><Icon name="close" size={17}/></button></div>}
 </header>
}