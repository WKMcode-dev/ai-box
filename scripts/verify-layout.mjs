import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { resolve, sep, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

// Run against the actual Pages build, including its /ai-box/ asset base.
const root = fileURLToPath(new URL("../frontend/dist-pages/", import.meta.url));
const reference = await readFile(
  new URL("../frontend/tests/fixtures/shift-card-ai.svg", import.meta.url),
  "utf8",
);
const referencePaths = [...reference.matchAll(/\bd="([^"]+)"/g)].map((match) =>
  match[1].trim().replace(/\s+/g, " "),
);
assert.equal(referencePaths.length, 6);
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (!pathname.startsWith("/ai-box/")) throw new Error("Invalid base");
    const file = resolve(root, pathname.slice(8) || "index.html");
    if (!file.startsWith(resolve(root) + sep)) throw new Error("Invalid path");
    response.setHeader(
      "Content-Type",
      mime[extname(file)] || "application/octet-stream",
    );
    response.end(await readFile(file));
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${server.address().port}/ai-box/`;
let browser;
const failures = [];
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: process.env.CHROMIUM_EXECUTABLE_PATH
      ? [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-zygote",
          "--use-gl=disabled",
        ]
      : [],
  });
  for (const desktop of [false, true]) {
    for (const width of desktop
      ? [390, 1360]
      : [320, 390, 570, 760, 768, 1024, 1360, 1440, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on("pageerror", (error) => failures.push(error.message));
      if (desktop)
        await page.addInitScript(() => {
          window.windowCalls = [];
          window.desktopWindow = Object.fromEntries(
            ["minimize", "maximize", "close"].map((action) => [
              action,
              () => window.windowCalls.push(action),
            ]),
          );
        });
      await page.goto(url);
      await page.locator(".shift-card").first().waitFor();
      // Compare the rendered vector with the user's independent reference.
      assert.deepEqual(
        await page
          .locator(".shift-card")
          .first()
          .locator(".shift-vector path")
          .evaluateAll((paths) =>
            paths
              .map((path) => path.getAttribute("d").trim().replace(/\s+/g, " "))
              .sort(),
          ),
        [...referencePaths].sort(),
      );
      const pillErrors = await page
        .locator(".shift-card")
        .evaluateAll((cards) =>
          cards.flatMap((card) => {
            const paths = [...card.querySelectorAll(".shift-tag-outline")];
            const texts = [...card.querySelectorAll(".shift-tags span")];
            const pairs = texts.map((text, i) => [text, paths[i]]);
            pairs.push([
              card.querySelector(".shift-pricing"),
              card.querySelector(".shift-pricing-outline"),
            ]);
            return pairs.filter(([text, path]) => {
              const a = text.getBoundingClientRect(),
                b = path.getBoundingClientRect();
              return ["x", "y", "width", "height"].some(
                (key) => Math.abs(a[key] - b[key]) > 0.05,
              );
            }).length;
          }),
        );
      assert.equal(
        pillErrors.reduce((sum, errors) => sum + errors, 0),
        0,
        "Text must match all four original pill bounds",
      );
      const statusErrors = await page.locator(".shift-card").evaluateAll(
        (cards) =>
          cards.filter((card) => {
            const status = card.querySelector(".shift-pricing");
            const title = card
              .querySelector(".shift-heading strong")
              .getBoundingClientRect();
            const badge = status.getBoundingClientRect();
            const label = status.querySelector("span").getBoundingClientRect();
            const category = card
              .querySelector(".shift-category")
              .getBoundingClientRect();
            const description = card
              .querySelector(".shift-description")
              .getBoundingClientRect();
            return (
              !status.querySelector("svg") ||
              title.right > badge.left + 1 ||
              label.right > badge.right + 1 ||
              label.left < badge.left - 1 ||
              description.bottom > category.top + 1
            );
          }).length,
      );
      assert.equal(
        statusErrors,
        0,
        "Upper-right status, title and category must remain aligned without overlap",
      );
      const inspect = () => {
        const box = (element) => element.getBoundingClientRect();
        const cards = [...document.querySelectorAll(".shift-card")];
        const hero = box(document.querySelector(".hero-dashboard"));
        const catalog = box(document.querySelector(".catalog"));
        const ids = [...document.querySelectorAll("[id]")].map(
          (node) => node.id,
        );
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          overlap: hero.bottom > catalog.top + 1,
          oldCards: document.querySelectorAll(".card,.card-art").length,
          badRatios: cards.filter(
            (card) =>
              Math.abs(
                box(card).width / box(card).height -
                  114 /
                    card.querySelector(".shift-vector").viewBox.baseVal.height,
              ) > 0.01,
          ).length,
          duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i).length,
          escapedText: cards.flatMap((card) =>
            [
              ...card.querySelectorAll(
                ".shift-content,.shift-category,.shift-tags",
              ),
            ].filter((element) => {
              const a = box(element),
                b = box(card);
              return (
                a.left < b.left - 1 ||
                a.right > b.right + 1 ||
                a.top < b.top - 1 ||
                a.bottom > b.bottom + 1
              );
            }),
          ).length,
          paintContainment: getComputedStyle(
            document.querySelector(".hologram-panel"),
          ).contain.includes("paint"),
        };
      };
      assert.deepEqual(
        await page.evaluate(inspect),
        {
          overflow: false,
          overlap: false,
          oldCards: 0,
          badRatios: 0,
          duplicateIds: 0,
          escapedText: 0,
          paintContainment: true,
        },
        `${width}px desktop=${desktop}`,
      );
      assert.equal(
        await page
          .locator(".shift-category")
          .first()
          .evaluate((node) => getComputedStyle(node).clipPath),
        "none",
      );
      const target = page.locator(".shift-card").first();
      await target.scrollIntoViewIfNeeded();
      const beforeHover = await target.boundingBox();
      await target.hover();
      await page.waitForFunction(
        () =>
          Number(
            getComputedStyle(document.querySelector(".shift-glow")).opacity,
          ) > 0.9,
      );
      const afterHover = await target.boundingBox();
      assert.ok(
        Math.abs(beforeHover.y - afterHover.y) < 0.1 &&
          Math.abs(beforeHover.x - afterHover.x) < 0.1,
        "Hover must not move the card",
      );
      const cubeStart = await page
        .locator(".holo-cube")
        .getAttribute("data-turn");
      await page.waitForFunction(
        (start) => document.querySelector(".holo-cube").dataset.turn !== start,
        cubeStart,
      );
      const cubeIcons = await page
        .locator(".holo-cube-icon")
        .evaluateAll((nodes) =>
          nodes.map((node) => ({
            id: node.dataset.toolId,
            href: node.getAttribute("href"),
          })),
        );
      assert.ok(cubeIcons.length >= 2);
      assert.ok(
        cubeIcons.every((icon) => icon.href.startsWith("/ai-box/logos/")),
      );
      assert.equal(
        await page.locator(".holo-cube animateTransform").count(),
        0,
      );
      const ringColors = await page
        .locator(".holo-part path")
        .evaluateAll((nodes) => [
          ...new Set(nodes.map((node) => getComputedStyle(node).fill)),
        ]);
      assert.deepEqual(ringColors, ["rgb(192, 245, 130)"]);
      if (!desktop && width === 1440) {
        const cycle = await page
          .locator(".holo-cube")
          .getAttribute("data-icon-cycle");
        await page.waitForFunction(
          (value) =>
            document.querySelector(".holo-cube").dataset.iconCycle !== value,
          cycle,
          { timeout: 6000 },
        );
        const nextIcons = await page
          .locator(".holo-cube-icon")
          .evaluateAll((nodes) => nodes.map((node) => node.dataset.toolId));
        assert.notDeepEqual(
          nextIcons,
          cubeIcons.map((icon) => icon.id),
        );
      }
      // Sample the complete opening, horizontal turn and closing cycle.
      for (const time of [0, 3, 7, 11, 14, 22, 31]) {
        const mechanism = await page.evaluate((time) => {
          const svg = document.querySelector(".holo-mechanism");
          svg.pauseAnimations();
          svg.setCurrentTime(time);
          const bounds = document
            .querySelector(".holo-stage")
            .getBoundingClientRect();
          const parts = [...svg.querySelectorAll(".holo-part,.holo-cube")].map(
            (p) => p.getBoundingClientRect(),
          );
          const base = svg
            .querySelector('[data-layer="base"]')
            .getBoundingClientRect();
          const cover = svg.querySelector('[data-layer="cover"]');
          return {
            escaped: parts.some(
              (p) =>
                p.left < bounds.left - 1 ||
                p.right > bounds.right + 1 ||
                p.top < bounds.top - 1 ||
                p.bottom > bounds.bottom + 1,
            ),
            horizontal: base.width > base.height,
            lift: cover.transform.animVal.numberOfItems
              ? cover.transform.animVal.getItem(0).matrix.f
              : 0,
            rootTransform: getComputedStyle(svg).transform,
          };
        }, time);
        assert.equal(
          mechanism.escaped,
          false,
          `Mechanism escaped at ${time}s in ${width}px`,
        );
        assert.equal(
          mechanism.horizontal,
          true,
          "Rings must stay horizontal throughout the turn",
        );
        assert.equal(mechanism.rootTransform, "none");
        if (time === 0) assert.equal(mechanism.lift, 0);
        if (time === 7)
          assert.ok(
            mechanism.lift < -70,
            "Cover must lift upward in the open phase",
          );
        assert.equal((await page.evaluate(inspect)).overlap, false);
      }
      await page
        .getByRole("button", { name: "Conhecer ChatGPT", exact: true })
        .click();
      await page.getByRole("dialog").waitFor();
      await page.getByRole("button", { name: "Fechar detalhes" }).click();
      await page
        .getByRole("textbox", { name: "Buscar inteligências artificiais" })
        .fill("chatgpt");
      await page.waitForFunction(
        () => document.querySelectorAll(".shift-card").length === 1,
      );
      assert.ok((await page.locator(".shift-card").boundingBox()).width <= 460);
      await page.getByRole("button", { name: "Limpar busca" }).click();
      await page
        .locator(".chip")
        .filter({ hasText: /^Áudio$/ })
        .click();
      assert.ok(
        (await page.locator(".shift-category").allTextContents()).every(
          (text) => text.includes("Áudio"),
        ),
      );
      if (desktop) {
        for (const name of [
          "Minimizar janela",
          "Maximizar ou restaurar janela",
          "Fechar janela",
        ])
          await page.getByRole("button", { name }).click();
        assert.deepEqual(await page.evaluate(() => window.windowCalls), [
          "minimize",
          "maximize",
          "close",
        ]);
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForFunction(
        () =>
          document.querySelector(".holo-mechanism").dataset.motion ===
          "reduced",
      );
      assert.equal(
        await page.locator(".holo-mechanism animateTransform").count(),
        0,
      );
      assert.equal(
        await page
          .locator(".holo-cube")
          .evaluate((node) => getComputedStyle(node).animationName),
        "none",
      );
      const reducedTurn = await page
        .locator(".holo-cube")
        .getAttribute("data-turn");
      await page.waitForTimeout(120);
      assert.equal(
        await page.locator(".holo-cube").getAttribute("data-turn"),
        reducedTurn,
      );
      if (process.env.QA_SCREENSHOTS) {
        await mkdir(process.env.QA_SCREENSHOTS, { recursive: true });
        await page.screenshot({
          path: join(
            process.env.QA_SCREENSHOTS,
            `${desktop ? "desktop" : "web"}-${width}.png`,
          ),
        });
      }
      console.log(
        `Layout, busca, categoria, modal e movimento reduzido: ${width}px${desktop ? " (desktop simulado)" : ""}`,
      );
      await page.close();
    }
  }
  // Exercise labels absent from today's catalog without modifying production data.
  const catalog = JSON.parse(
    await readFile(join(root, "catalog.json"), "utf8"),
  );
  for (const width of [320, 1440]) {
    for (const count of [0, 1, 2, 4, 7]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const tags = Array.from({ length: count }, (_, i) => "Status " + (i + 1));
      await page.route("**/catalog.json", (route) =>
        route.fulfill({ json: { tools: [{ ...catalog.tools[0], tags }] } }),
      );
      await page.goto(url);
      await page.locator(".shift-card").waitFor();
      assert.equal(await page.locator(".shift-tags span").count(), count);
      assert.equal(await page.locator(".shift-tag-outline").count(), count);
      assert.equal(
        await page
          .locator(".shift-category")
          .evaluate((node) => getComputedStyle(node).clipPath),
        "none",
      );
      const layout = await page.locator(".shift-card").evaluate((card) => {
        const svg = card.querySelector(".shift-vector"),
          bounds = card.getBoundingClientRect();
        const pills = [...card.querySelectorAll(".shift-tag-outline")].map(
          (p) => p.getBoundingClientRect(),
        );
        return {
          height: svg.viewBox.baseVal.height,
          overflow: document.documentElement.scrollWidth > innerWidth,
          escaped: pills.some(
            (p) =>
              p.left < bounds.left ||
              p.right > bounds.right + 0.1 ||
              p.bottom > bounds.bottom + 0.1,
          ),
        };
      });
      assert.equal(layout.overflow, false);
      assert.equal(layout.escaped, false);
      assert.equal(
        layout.height,
        42 + Math.max(0, Math.ceil(count / 3) - 1) * 7,
      );
      console.log(`Recorte adaptativo: ${count} etiquetas em ${width}px`);
      await page.close();
    }
  }
  assert.deepEqual(failures, []);
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
