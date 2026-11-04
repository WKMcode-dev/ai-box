import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { sendJson } from "./sendJson.js";
const defaultDirectory = fileURLToPath(
  new URL("../../../frontend/dist/", import.meta.url),
);
const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};
export async function serveFrontend(
  request: IncomingMessage,
  response: ServerResponse,
  directory = defaultDirectory,
): Promise<void> {
  if (!["GET", "HEAD"].includes(request.method ?? "")) {
    response.setHeader("Allow", "GET, HEAD");
    return sendJson(response, 405, { error: "Método não permitido." });
  }
  try {
    const pathname = decodeURIComponent(
      new URL(request.url ?? "/", "http://localhost").pathname,
    );
    const file = resolve(
      directory,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (
      !file.startsWith(resolve(directory) + sep) ||
      !contentTypes[extname(file)]
    )
      return sendJson(response, 404, { error: "Arquivo não encontrado." });
    const contents = await readFile(file);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(file)],
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    });
    response.end(request.method === "HEAD" ? undefined : contents);
  } catch {
    sendJson(response, 404, {
      error:
        "Arquivo não encontrado. Execute npm run build para preparar a interface.",
    });
  }
}
