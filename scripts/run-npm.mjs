import { spawnSync } from "node:child_process";
export function runNpm(args, env = process.env) {
  if (!process.env.npm_execpath)
    throw new Error("Execute este comando usando npm run.");
  const result = spawnSync(
    process.execPath,
    [process.env.npm_execpath, ...args],
    { stdio: "inherit", env },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
