import test from "node:test";
import assert from "node:assert/strict";
import { readCatalog } from "../src/repositories/catalogRepository.js";
import { validateCatalog } from "../src/repositories/validateCatalog.js";
test("ChatGPT está presente e Whisper não usa a logo dele", async () => {
  const tools = await readCatalog();
  const chatgpt = tools.find((tool) => tool.id === "chatgpt");
  const whisper = tools.find((tool) => tool.id === "whisper");
  assert.ok(chatgpt);
  assert.ok(whisper);
  assert.equal(chatgpt.pricing, "freemium");
  assert.equal(whisper.logoKind, "text");
  assert.equal(whisper.logo, null);
  assert.notEqual(chatgpt.logo, whisper.logo);
});
test("não aceita ofertas pagas nem dados de marca incoerentes", async () => {
  const [tool] = await readCatalog();
  assert.throws(
    () => validateCatalog([{ ...tool, pricing: "paid" }]),
    /gratuit/,
  );
  assert.throws(
    () =>
      validateCatalog([
        { ...tool, logoKind: "text", logo: "/logos/chatgpt.svg" },
      ]),
    /logo/,
  );
  assert.throws(
    () =>
      validateCatalog([{ ...tool, pricingSourceUrl: "http://example.com" }]),
    /HTTPS/,
  );
});

test("OriginKit está presente como framework e informa os limites do plano gratuito", async () => {
  const tools = await readCatalog();
  const originKit = tools.find((tool) => tool.id === "originkit");
  assert.ok(originKit);
  assert.equal(originKit.kind, "Framework");
  assert.equal(originKit.category, "Código");
  assert.equal(originKit.pricing, "freemium");
  assert.match(originKit.usageNote, /limites diários/);
});


test("catálogo de Cibersegurança mantém origem, subcategoria e IDs únicos", async () => {
  const tools = await readCatalog();
  const security = tools.filter((tool) => tool.category === "Cibersegurança");
  assert.ok(security.length > 100);
  assert.equal(new Set(security.map((tool) => tool.id)).size, security.length);
  assert.ok(security.every((tool) => typeof tool.subcategory === "string" && tool.subcategory.length > 0));
  assert.ok(security.every((tool) => ["Kali", "Ubuntu", "Complementar", undefined].includes(tool.sourceDistro)));
  assert.ok(security.some((tool) => tool.id === "aircrack-ng"));
  assert.ok(security.some((tool) => tool.id === "bloodhound"));
  assert.ok(security.some((tool) => tool.id === "volatility3"));
  assert.ok(security.some((tool) => tool.id === "suricata" && tool.sourceDistro === "Complementar"));
  assert.equal(security.find((tool) => tool.id === "wireshark")?.subcategory, "Captura, análise e manipulação de tráfego");
  assert.ok(security.some((tool) => tool.id === "burp-suite" && tool.pricing === "freemium"));
});
