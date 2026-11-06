import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("as camadas do mecanismo preservam todos os paths originais do Group 45 uma única vez", () => {
  const original = readFileSync(
    new URL("../public/hologram/group-45.svg", import.meta.url),
    "utf8",
  );
  const paths = [...original.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const layers = JSON.parse(
    readFileSync(
      new URL(
        "../src/components/hero/data/group45Layers.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.deepEqual(
    layers
      .flatMap((layer: { paths: { d: string }[] }) =>
        layer.paths.map((p) => p.d),
      )
      .sort(),
    paths.sort(),
  );
  assert.equal(layers.length, 5);
  assert.equal(layers[0].lift, 0);
  for (let i = 1; i < layers.length; i++) {
    assert.ok(layers[i].lift < layers[i - 1].lift);
    assert.ok(layers[i].delay > layers[i - 1].delay);
  }
});

test("o cubo mantém a tampa e as arestas unidas durante uma volta horizontal completa", async () => {
  const { cubeFaces } = await import("../src/components/hero/cubeGeometry");
  for (let degree = 0; degree <= 360; degree += 5) {
    const faces = cubeFaces((degree * Math.PI) / 180);
    assert.ok(
      faces.some((face) => face.index === 4),
      "Tampa sempre visível",
    );
    assert.ok(faces.length >= 2 && faces.length <= 3);
    const vertices = faces.flatMap((face) => face.points.split(" "));
    const lid = faces.find((face) => face.index === 4)!.points.split(" ");
    for (const face of faces.filter((face) => face.index !== 4)) {
      assert.ok(
        face.points
          .split(" ")
          .slice(0, 2)
          .every((vertex) => lid.includes(vertex)),
      );
    }
    const ys = vertices.map((p) => Number(p.split(",")[1]));
    assert.ok(Math.max(...ys) - Math.min(...ys) < 73);
  }
  const rounded = (angle: number) =>
    cubeFaces(angle).map((face) => ({
      index: face.index,
      vertices: face.points
        .split(/[ ,]/)
        .map((n) => Math.round(Number(n) * 1e6)),
    }));
  assert.deepEqual(rounded(0), rounded(2 * Math.PI));
});
