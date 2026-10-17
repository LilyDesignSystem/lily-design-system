#!/usr/bin/env node
// Build `dist/` with svelte-package.
//
// The package keeps a flat layout (runtime source, tests, docs and
// config all at the root), and svelte-package copies *everything* in its
// input directory into the output with no ignore mechanism. So stage
// only the runtime source files into a throwaway `.svelte-package-src/`,
// run svelte-package against that, emit to `dist/`, then delete the
// staging dir. "Runtime source" = the `.ts` and `.svelte` files that are
// not tests, config, or Storybook stories.

import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const stageDir = path.join(root, ".svelte-package-src");
const distDir = path.join(root, "dist");

const sveltePackageBin = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "svelte-package.cmd" : "svelte-package",
);

/** Is this a runtime source file we want in the published package? */
function isRuntimeSource(name) {
  if (name.endsWith(".test.ts") || name.endsWith(".spec.ts")) return false;
  if (name.includes(".stories.")) return false;
  if (name.endsWith(".config.ts")) return false;
  if (name.endsWith("TestHost.svelte")) return false;
  return name.endsWith(".ts") || name.endsWith(".svelte");
}

fs.rmSync(stageDir, { recursive: true, force: true });
fs.mkdirSync(stageDir, { recursive: true });

const runtimeFiles = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isFile() && isRuntimeSource(entry.name))
  .map((entry) => entry.name);

for (const file of runtimeFiles) {
  fs.copyFileSync(path.join(root, file), path.join(stageDir, file));
}

try {
  execFileSync(sveltePackageBin, ["-i", stageDir, "-o", distDir], {
    cwd: root,
    stdio: "inherit",
  });
} finally {
  fs.rmSync(stageDir, { recursive: true, force: true });
  // svelte-package writes d.ts to a `.svelte-kit/__package__` temp dir.
  fs.rmSync(path.join(root, ".svelte-kit"), { recursive: true, force: true });
}

console.log(`built dist (${runtimeFiles.join(", ")})`);
