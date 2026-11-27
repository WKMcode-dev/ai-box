import {useCallback,useEffect,useMemo,useState} from "react";
import type {Tool} from "@ai-box/contracts";
import {getCatalog} from "../api/catalogApi";
import {getCatalogCounts} from "../utils/getCatalogCounts";
import {filterTools} from "../utils/filterTools";

export function useCatalog(){
 const [tools,setTools]=useState<Tool[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [attempt,setAttempt]=useState(0);
 const [category,setCategory]=useState("Todas as IAs");
 const [pricing,setPricing]=useState("all");
 const [access,setAccess]=useState("all");
 const [sort,setSort]=useState("featured");
 const [query,setQuery]=useState("");
 const [securitySubcategory,setSecuritySubcategory]=useState("Todas as áreas");
 const retry=useCallback(()=>setAttempt(v=>v+1),[]);
 useEffect(()=>{const c=new AbortController();setLoading(true);setError("");getCatalog(c.signal).then(d=>setTools(d.tools)).catch(()=>{if(!c.signal.aborted)setError("Não conseguimos abrir a BOX. Tente novamente.")}).finally(()=>{if(!c.signal.aborted)setLoading(false)});return()=>c.abort()},[attempt]);
 const counts=useMemo(()=>getCatalogCounts(tools),[tools]);
 const filtered=useMemo(()=>filterTools(tools,category,query,sort,access,pricing),[tools,category,query,sort,access,pricing]);
 const results=useMemo(()=>category!=="Cibersegurança"||securitySubcategory==="Todas as áreas"?filtered:filtered.filter(t=>t.subcategory===securitySubcategory),[filtered,category,securitySubcategory]);
 function clearFilters(){setQuery("");setAccess("all");setPricing("all");setCategory("Todas as IAs");setSecuritySubcategory("Todas as áreas")}
 return {pricing,setPricing,access,setAccess,tools,counts,results,loading,error,retry,category,setCategory,sort,setSort,query,setQuery,securitySubcategory,setSecuritySubcategory,clearFilters};
}