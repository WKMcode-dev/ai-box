import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Tool } from "@ai-box/contracts";
import { filterTools } from "../src/features/catalog/utils/filterTools";
const tools = JSON.parse(
  readFileSync(
    new URL("../../backend/data/catalog.json", import.meta.url),
    "utf8",
  ),
) as Tool[];
test("busca ignora acentos, espaços externos e combina com categoria", () => {
  const results = filterTools(tools, "Áudio", "  TRANSCRICAO  ", "featured");
  assert.ok(results.length >= 2);
  assert.ok(results.every((tool) => tool.category === "Áudio"));
  assert.deepEqual(
    filterTools(tools, "Vídeo", "zzzz-nao-existe", "featured"),
    [],
  );
});
test("filtra forma de acesso e ordena sem alterar fonte", () => {
  const original = tools.map((tool) => tool.id);
  const browser = filterTools(tools, "Todas as IAs", "", "az", "browser");
  assert.ok(browser.length > 0);
  assert.ok(browser.every((tool) => tool.access === "browser"));
  assert.deepEqual(
    browser.map((tool) => tool.name),
    browser
      .map((tool) => tool.name)
      .sort((a, b) => a.localeCompare(b, "pt-BR")),
  );
  assert.deepEqual(
    tools.map((tool) => tool.id),
    original,
  );
});
test("filtra planos gratuitos com limites sem misturar com execução local gratuita", () => {
  const cloud = filterTools(
    tools,
    "Todas as IAs",
    "",
    "featured",
    "online",
    "freemium",
  );
  assert.ok(cloud.some((tool) => tool.id === "chatgpt"));
  assert.ok(
    cloud.every(
      (tool) => tool.pricing === "freemium" && tool.access === "online",
    ),
  );
  const local = filterTools(
    tools,
    "Todas as IAs",
    "",
    "featured",
    "local",
    "free",
  );
  assert.ok(local.some((tool) => tool.id === "ollama"));
  assert.ok(!local.some((tool) => tool.id === "chatgpt"));
});
