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
