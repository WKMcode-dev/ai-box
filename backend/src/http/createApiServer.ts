import { serveFrontend } from "./serveFrontend.js";
import { createServer } from "node:http";
import { getCatalog } from "../services/catalogService.js";
import { sendJson } from "./sendJson.js";
export function createApiServer(staticDirectory?: string) {
  return createServer(async (request, response) => {
    const path = new URL(request.url ?? "/", "http://localhost").pathname;
    if (!path.startsWith("/api/"))
      return serveFrontend(request, response, staticDirectory);
    if (!["/api/tools", "/api/health"].includes(path))
      return sendJson(response, 404, { error: "Rota não encontrada." });
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      return sendJson(response, 405, { error: "Método não permitido." });
    }
    try {
      sendJson(
        response,
        200,
        path === "/api/health" ? { status: "ok" } : await getCatalog(),
      );
    } catch (error) {
      console.error("Falha ao carregar catálogo:", error);
      sendJson(response, 500, {
        error: "Não foi possível carregar o catálogo.",
      });
    }
  });
}
