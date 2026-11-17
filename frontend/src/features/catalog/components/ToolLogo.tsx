import { assetUrl } from "../../../utils/assetUrl";
import { useState } from "react";
import type { Tool } from "@ai-box/contracts";
interface Props { tool: Tool }
const symbols: Record<string, string> = {
  Texto: "M8 12h16M8 18h10M8 6h16",
  Imagem: "M6 6h20v20H6z M13 13a2 2 0 1 0 0 .01 M8 23l6-6 4 4 3-3 5 5",
  Vídeo: "M5 8h18v16H5z M23 13l6-4v14l-6-4z",
  Áudio: "M8 18V9l16-4v13 M5 17a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M21 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  Código: "m12 9-6 7 6 7 M20 9l6 7-6 7 M18 6l-4 20",
  Produtividade: "M6 8h20v18H6z M12 8V5h8v3 M6 14h20 M14 14v3h4v-3",
  Pesquisa: "M15 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16 M21 20l6 6 M11 14h8 M15 10v8",
  Cibersegurança: "M16 4 26 8v7c0 7-4 11-10 14C10 26 6 22 6 15V8z M11 16l3 3 7-8",
};
const palette: Record<string, string> = { mint:"#72f5a5",peach:"#efa882",purple:"#bb98ff",blue:"#79caff",pink:"#f391bd",yellow:"#f0d271",green:"#9fe38a" };
function GeneratedLogo({tool}:{tool:Tool}) {
 const color=palette[tool.color]||"#a8c99b";
 const initials=tool.name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").split(/[^A-Za-z0-9]+/).filter(Boolean).slice(0,2).map(part=>part[0]).join("").toUpperCase()||"AI";
 return <svg className="generated-logo" viewBox="0 0 32 32" role="img" aria-label={"Símbolo ilustrativo de "+tool.name}>
  <defs><linearGradient id={"logo-"+tool.id} x1="0" y1="0" x2="1" y2="1"><stop stopColor={color} stopOpacity=".28"/><stop offset="1" stopColor="#101713"/></linearGradient></defs>
  <rect x="1" y="1" width="30" height="30" rx="8" fill={"url(#logo-"+tool.id+")"} stroke={color} strokeOpacity=".62"/>
  <path d={symbols[tool.category]||symbols.Cibersegurança} transform="translate(1 0) scale(.94)" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <text x="16" y="28" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.2" fontWeight="700" fill="#eff8ef">{initials}</text>
 </svg>;
}
export function ToolLogo({tool}:Props) {
 const [failed,setFailed]=useState(false);
 return <div className="tool-logo">
  {tool.logoKind==="generated" ? <GeneratedLogo tool={tool}/> :
   !tool.logo||failed ? <div className="project-name"><span>{tool.name}</span><small>{tool.maker}</small></div> :
   <img src={assetUrl(tool.logo)} alt={"Logo oficial de "+tool.logoLabel} onError={()=>setFailed(true)} loading="lazy"/>}
 </div>;
}
