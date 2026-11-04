import { useCallback, useEffect, useMemo, useState } from "react";
import type { Tool } from "@ai-box/contracts";
import { getCatalog } from "../api/catalogApi";
import { filterTools } from "../utils/filterTools";
export function useCatalog() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [category, setCategory] = useState("Todas as IAs");
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState("all");
  const [access, setAccess] = useState("all");
  const [sort, setSort] = useState("featured");
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getCatalog(controller.signal)
      .then((data) => setTools(data.tools))
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Não conseguimos abrir a BOX. Tente novamente.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);
  const results = useMemo(
    () => filterTools(tools, category, query, sort, access, pricing),
    [tools, category, query, sort, access, pricing],
  );
  function clearFilters() {
    setQuery("");
    setAccess("all");
    setPricing("all");
    setCategory("Todas as IAs");
  }
  return {
    pricing,
    setPricing,
    access,
    setAccess,
    tools,
    results,
    loading,
    error,
    retry,
    category,
    setCategory,
    query,
    setQuery,
    sort,
    setSort,
    clearFilters,
  };
}
