#!/usr/bin/env node
// Build dist/: Vite library mode for dist/index.js (vite.lib.config.ts),
// then vue-tsc for the matching .d.ts files (tsconfig.lib.json), then
// fail loudly if either artifact is missing or empty, since `files` ships
// only dist/ and an empty one would publish a package that exports nothing.
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: "inherit" });

run("npx", ["vite", "build", "--config", "vite.lib.config.ts"]);
run("npx", ["vue-tsc", "-p", "tsconfig.lib.json", "--emitDeclarationOnly"]);

for (const artifact of ["index.js", "index.d.ts"]) {
  const file = resolve(root, "dist", artifact);
  if (!existsSync(file) || statSync(file).size === 0) {
    throw new Error(`expected a non-empty dist/${artifact} after build, but it is missing or empty`);
  }
}
console.log("built dist");
