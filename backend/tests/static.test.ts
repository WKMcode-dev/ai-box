import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApiServer } from "../src/http/createApiServer.js";
test("produção serve interface, SVG e HEAD e bloqueia arquivos fora da pasta pública", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ai-box-test-"));
  await mkdir(join(directory, "logos"));
  await writeFile(join(directory, "index.html"), "<title>A.I BOX</title>");
  await writeFile(
    join(directory, "logos", "logo.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg"/>',
  );
  const server = createApiServer(directory);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}`;
  try {
    assert.match(await (await fetch(url)).text(), /A.I BOX/);
    const image = await fetch(url + "/logos/logo.svg");
    assert.equal(image.headers.get("content-type"), "image/svg+xml");
    const head = await fetch(url, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    assert.equal((await fetch(url + "/%2e%2e%2fpackage.json")).status, 404);
    assert.equal((await fetch(url + "/logos/%00.svg")).status, 404);
    assert.equal((await fetch(url, { method: "POST" })).status, 405);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    await rm(directory, { recursive: true, force: true });
  }
});
