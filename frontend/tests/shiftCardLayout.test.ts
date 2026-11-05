import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { shiftCardLayout } from "../src/features/catalog/utils/shiftCardLayout";

test("três etiquetas preservam a silhueta original fornecida pelo usuário", () => {
  const svg = readFileSync(
    new URL("./fixtures/shift-card-ai.svg", import.meta.url),
    "utf8",
  );
  const original = svg.match(/\bd="([^"]+)"/)![1];
  assert.equal(shiftCardLayout(["Chat", "GPT", "Escrita"]).body, original);
});

test("o recorte não reserva cápsulas vazias e acomoda todas as etiquetas", () => {
  for (const count of [0, 1, 2, 3, 4, 7, 10]) {
    const labels = Array.from({ length: count }, (_, i) => `Status ${i}`);
    const layout = shiftCardLayout(labels);
    assert.deepEqual(
      layout.tags.map((t) => t.label),
      labels,
    );
    for (const tag of layout.tags) {
      assert.ok(tag.x >= -229 && tag.x + 18 <= -115);
      assert.ok(tag.y >= -181 && tag.y + 5 <= -181 + layout.height);
    }
    for (let i = 0; i < layout.tags.length; i++)
      for (let j = i + 1; j < layout.tags.length; j++) {
        const a = layout.tags[i],
          b = layout.tags[j];
        assert.ok(
          a.x + 18 <= b.x ||
            b.x + 18 <= a.x ||
            a.y + 5 <= b.y ||
            b.y + 5 <= a.y,
        );
      }
  }
  assert.ok(
    shiftCardLayout(["A"]).tags[0].x > shiftCardLayout(["A", "B"]).tags[0].x,
  );
  assert.ok(
    shiftCardLayout(["A", "B"]).tags[0].x >
      shiftCardLayout(["A", "B", "C"]).tags[0].x,
  );
});
