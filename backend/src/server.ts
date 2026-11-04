import { createApiServer } from "./http/createApiServer.js";
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "127.0.0.1";
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("PORT inválida.");
const server = createApiServer();
server.listen(port, host, () =>
  console.log(`A.I BOX API: http://${host}:${port}`),
);
server.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () => server.close(() => process.exit(0)));
