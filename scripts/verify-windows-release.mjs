import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import yaml from "js-yaml";
import { NtExecutable, NtExecutableResource } from "resedit";
const root = new URL("../desktop/", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const manifest = yaml.load(
  await readFile(new URL("release/latest.yml", root), "utf8"),
);
assert.equal(manifest.version, pkg.version);
const name = `AI-BOX-${pkg.version}-x64-setup.exe`;
assert.equal(manifest.path, name);
const file = manifest.files.find((file) => file.url === name);
assert.ok(file);
const exe = await readFile(new URL("release/" + name, root));
assert.equal(exe.length, file.size);
assert.equal(createHash("sha512").update(exe).digest("base64"), file.sha512);
const feed = yaml.load(
  await readFile(
    new URL("release/win-unpacked/resources/app-update.yml", root),
    "utf8",
  ),
);
assert.equal(feed.provider, "generic");
assert.equal(feed.url, pkg.build.publish[0].url);
const binary = await readFile(
  new URL("release/win-unpacked/A.I BOX.exe", root),
);
const pe = NtExecutable.from(
  binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength),
);
const resources = NtExecutableResource.from(pe).entries;
const png = await readFile(new URL("build/icon.png", root));
assert.ok(
  resources.some(
    (entry) => entry.type === 3 && Buffer.from(entry.bin).equals(png),
  ),
  "Logo deve estar gravada dentro do executável",
);
assert.ok(
  resources.some((entry) => entry.type === 14),
  "Grupo de ícones deve estar presente",
);
console.log(
  `Windows ${pkg.version}: logo PE, feed, instalador e SHA-512 verificados.`,
);
