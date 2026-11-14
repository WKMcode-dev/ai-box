import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { readCatalog } from "../src/repositories/catalogRepository.js";
import { validateCatalog } from "../src/repositories/validateCatalog.js";
import { createApiServer } from "../src/http/createApiServer.js";

test("catálogo tem IDs únicos, dados válidos e SVGs locais existentes", async () => {
  const tools = await readCatalog();
  assert.ok(tools.length > 0);
  assert.equal(new Set(tools.map((tool) => tool.id)).size, tools.length);
  for (const tool of tools) {
    if (tool.logoKind === "text") {
      assert.equal(tool.logo, null);
      continue;
    }
    const path = new URL("../../frontend/public" + tool.logo, import.meta.url);
    await access(path);
    assert.match(await readFile(path, "utf8"), /<svg/);
  }
});
test("dados inválidos e IDs repetidos são rejeitados", async () => {
  const [tool] = await readCatalog();
  assert.throws(() => validateCatalog([tool, tool]), /duplicado/);
  assert.throws(
    () => validateCatalog([{ ...tool, url: "javascript:alert(1)" }]),
    /HTTPS/,
  );
  assert.throws(
    () => validateCatalog([{ ...tool, logo: "/logos/../../secret.svg" }]),
    /logo/,
  );
  assert.throws(() => validateCatalog([{ ...tool, tags: null }]), /Tags/);
  assert.throws(
    () => validateCatalog([{ ...tool, kind: "Plataforma" }]),
    /Tipo inválido para .*Plataforma/,
  );
});
test("API retorna catálogo, health e erros HTTP adequados", async () => {
  const server = createApiServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}`;
  try {
    const response = await fetch(url + "/api/tools");
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    assert.ok((await response.json()).tools.length > 0);
    assert.deepEqual(await (await fetch(url + "/api/health")).json(), {
      status: "ok",
    });
    assert.equal((await fetch(url + "/api/missing")).status, 404);
    const post = await fetch(url + "/api/tools", { method: "POST" });
    assert.equal(post.status, 405);
    assert.equal(post.headers.get("allow"), "GET");
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
