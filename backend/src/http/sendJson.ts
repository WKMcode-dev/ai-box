import type { ServerResponse } from "node:http";
export function sendJson(
  response: ServerResponse,
  status: number,
  body: unknown,
): void {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-cache",
  });
  response.end(JSON.stringify(body));
}
