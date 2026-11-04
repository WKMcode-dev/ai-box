import { app, protocol } from "electron";
import { readFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};
const csp =
  "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'";
export function registerContentProtocol() {
  const directory = app.isPackaged
    ? resolve(process.resourcesPath, "site")
    : fileURLToPath(new URL("../../frontend/dist-desktop/", import.meta.url));
  protocol.handle("aibox", async (request) => {
    try {
      const url = new URL(request.url);
      if (url.hostname !== "box" || request.method !== "GET")
        return new Response(null, { status: 403 });
      const path = resolve(directory, "." + decodeURIComponent(url.pathname));
      if (!path.startsWith(directory + sep) || !mime[extname(path)])
        return new Response(null, { status: 404 });
      const content = await readFile(path);
      return new Response(content, {
        headers: {
          "Content-Type": mime[extname(path)],
          "Content-Security-Policy": csp,
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      return new Response(null, { status: 404 });
    }
  });
}
