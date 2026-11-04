import { readFile, access } from "node:fs/promises";
for (const target of process.argv.slice(2)) {
  const root = new URL(`../frontend/dist-${target}/`, import.meta.url);
  const html = await readFile(new URL("index.html", root), "utf8");
  const data = JSON.parse(
    await readFile(new URL("catalog.json", root), "utf8"),
  );
  if (data.tools.length !== 108)
    throw new Error(`${target}: catálogo incompleto`);
  for (const tool of data.tools)
    if (tool.logo) await access(new URL(tool.logo.replace(/^\//, ""), root));
  const scripts = [
    ...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css|svg))"/g),
  ].map((match) => match[1]);
  for (const source of scripts) {
    const prefix =
      target === "pages" ? process.env.PAGES_BASE_PATH || "/ai-box/" : "./";
    if (!source.startsWith(prefix))
      throw new Error(`${target}: recurso fora da base: ${source}`);
    await access(new URL(source.slice(prefix.length), root));
  }
  console.log(`${target}: HTML, catálogo, logos e caminhos verificados.`);
}
