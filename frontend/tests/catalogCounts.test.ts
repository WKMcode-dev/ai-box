import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Tool } from "@ai-box/contracts";
import { getCatalogCounts } from "../src/features/catalog/utils/getCatalogCounts";

const tools = JSON.parse(
  readFileSync(new URL("../../backend/data/catalog.json", import.meta.url), "utf8"),
) as Tool[];

test("totais acompanham as ferramentas carregadas por categoria", () => {
  const security = tools.filter((tool) => tool.category === "Cibersegurança");
  const ai = tools.filter((tool) => tool.category !== "Cibersegurança");
  const previous = getCatalogCounts([...ai, ...security.slice(0, 179)]);
  const current = getCatalogCounts(tools);

  assert.equal(previous.security, 179);
  assert.equal(current.security, 265);
  assert.equal(current.ai, 118);
  assert.equal(current.ai, previous.ai);
  assert.equal(current.byCategory.get("Cibersegurança"), current.security);
  assert.equal(getCatalogCounts([]).security, 0);
});
