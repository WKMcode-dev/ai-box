import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { resolve, sep, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

// Run against the actual Pages build, including its /ai-box/ asset base.
const root = fileURLToPath(new URL("../frontend/dist-pages/", import.meta.url));
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
              Math.abs(box(card).width / box(card).height - 114 / 42) > 0.01,
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
      // Check several animation phases without changing the reserved layout.
      for (const time of [0, 1500, 4500, 9000]) {
        await page.evaluate(
          (time) =>
            document.getAnimations().forEach((animation) => {
              animation.pause();
              animation.currentTime = time;
            }),
          time,
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
      assert.equal(
        await page
          .locator(".holo-cube")
          .evaluate((node) => getComputedStyle(node).animationName),
        "none",
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
  assert.deepEqual(failures, []);
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
