import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
test("ícone Windows contém nove tamanhos e a mesma logo PNG", () => {
  const ico = readFileSync(new URL("../build/icon.ico", import.meta.url));
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 9);
  const at = 6 + 8 * 16,
    size = ico.readUInt32LE(at + 8),
    offset = ico.readUInt32LE(at + 12);
  assert.deepEqual(
    ico.subarray(offset, offset + size),
    readFileSync(new URL("../build/icon.png", import.meta.url)),
  );
  const pkg = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url)),
  );
  assert.notEqual(pkg.build.win.signAndEditExecutable, false);
  assert.equal(pkg.build.publish[0].provider, "generic");
  assert.ok(pkg.build.publish[0].url.endsWith("/releases/latest/download/"));
});
