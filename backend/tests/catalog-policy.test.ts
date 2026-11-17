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


test("categoria Cibersegurança contém a seleção Windows/WSL documentada", async () => {
  const tools = await readCatalog();
  const security = tools.filter((tool) => tool.category === "Cibersegurança");
  const expected = ["mitmproxy","wireshark","ghidra","x64dbg","fakenet-ng","tcpdump","burp-suite","nmap","owasp-zap","sqlmap","ffuf","gobuster","hashcat","john-the-ripper","autopsy","jadx","apktool","yara","exiftool","testdisk","impacket","enum4linux-ng","nikto","whatweb","wafw00f"];
  assert.equal(security.length, expected.length);
  assert.deepEqual(new Set(security.map((tool) => tool.id)), new Set(expected));
  assert.ok(security.every((tool) => tool.logoKind === "text" && tool.logo === null));
  assert.ok(security.every((tool) => typeof tool.subcategory === "string" && tool.subcategory.length > 0));
  assert.equal(new Set(security.map((tool) => tool.subcategory)).size, 9);
  assert.equal(security.find((tool) => tool.id === "wireshark")?.subcategory, "Captura e análise de tráfego");
  assert.ok(security.some((tool) => tool.id === "tcpdump" && tool.access === "local"));
  assert.ok(security.some((tool) => tool.id === "burp-suite" && tool.pricing === "freemium"));
});
