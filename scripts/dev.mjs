import { spawn, spawnSync } from "node:child_process";
const children = [
  spawn(process.execPath, ["--import", "tsx", "--watch", "src/server.ts"], {
    cwd: new URL("../backend/", import.meta.url),
    stdio: "inherit",
  }),
  spawn(
    process.execPath,
    ["../node_modules/vite/bin/vite.js", "--host", "127.0.0.1"],
    { cwd: new URL("../frontend/", import.meta.url), stdio: "inherit" },
  ),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (process.platform === "win32" && child.pid)
      spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    else child.kill();
  }
  process.exitCode = code;
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => stop());
for (const child of children) {
  child.on("error", (error) => {
    console.error(error);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!stopping) stop(code ?? 1);
  });
}
