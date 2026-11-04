import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
const destination = resolve("AI-BOX-projeto.zip");
const entries = [
  "frontend",
  "desktop",
  ".github",
  "backend",
  "shared",
  "scripts",
  "docs",
  "package.json",
  "package-lock.json",
  "README.md",
  ".gitignore",
];
const result = spawnSync(
  "tar",
  [
    "-a",
    "-c",
    "-f",
    destination,
    "--exclude=node_modules",
    "--exclude=dist",
    "--exclude=dist-pages",
    "--exclude=dist-desktop",
    "--exclude=release",
    "--exclude=*.tsbuildinfo",
    ...entries,
  ],
  { stdio: "inherit" },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Projeto empacotado em ${destination}`);
