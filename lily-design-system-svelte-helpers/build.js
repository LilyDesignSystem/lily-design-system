#!/usr/bin/env node
// Build each publishable helper sub-package's `dist/` with svelte-package.
//
// Each helper keeps a flat layout (runtime source + tests + docs all sit at
// the package root), which suits the dev/test harness. svelte-package, by
// contrast, copies *everything* in its input directory into the output — it
// has no ignore mechanism. So for each package we stage only the runtime
// source files into a throwaway `.svelte-package-src/` directory, run
// svelte-package against that, emit to `dist/`, then delete the staging dir.
//
// "Runtime source" = the `.ts` and `.svelte` files that are not tests or
// Storybook stories. This auto-adapts as helpers gain new runtime modules,
// so there is no per-package file list to keep in sync.

import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

// Discovered rather than listed: a hardcoded list silently skips any new
// helper, and since each package's `prepublishOnly` runs this build and
// its `files` ships only `dist/`, a skipped package publishes with no
// code in it at all.
const packages = fs
  .readdirSync(root, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      entry.name.startsWith("lily-design-system-svelte-") &&
      fs.existsSync(path.join(root, entry.name, "index.ts")),
  )
  .map((entry) => entry.name)
  .sort();

const sveltePackageBin = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "svelte-package.cmd" : "svelte-package",
);

/** Is this a runtime source file we want in the published package? */
function isRuntimeSource(name) {
  if (name.endsWith(".test.ts") || name.endsWith(".test.tsx")) return false;
  if (name.endsWith(".spec.ts")) return false;
  if (name.includes(".stories.")) return false;
  return name.endsWith(".ts") || name.endsWith(".svelte");
}

for (const pkg of packages) {
  const pkgDir = path.join(root, pkg);
  const stageDir = path.join(pkgDir, ".svelte-package-src");
  const distDir = path.join(pkgDir, "dist");

  fs.rmSync(stageDir, { recursive: true, force: true });
  fs.mkdirSync(stageDir, { recursive: true });

  const runtimeFiles = fs
    .readdirSync(pkgDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isRuntimeSource(entry.name))
    .map((entry) => entry.name);

  for (const file of runtimeFiles) {
    fs.copyFileSync(path.join(pkgDir, file), path.join(stageDir, file));
  }

  try {
    // Run with cwd = the package dir so svelte-package's validator reads that
    // package's own package.json (its `exports` + `svelte` peerDependency) and
    // loads the package's `svelte.config.js`, rather than the catalog root's.
    execFileSync(sveltePackageBin, ["-i", stageDir, "-o", distDir], {
      cwd: pkgDir,
      stdio: "inherit",
    });
  } finally {
    fs.rmSync(stageDir, { recursive: true, force: true });
    // svelte-package writes d.ts to a `.svelte-kit/__package__` temp dir next
    // to its cwd; remove it so the working tree stays clean.
    fs.rmSync(path.join(pkgDir, ".svelte-kit"), { recursive: true, force: true });
  }

  console.log(`built ${pkg}/dist (${runtimeFiles.join(", ")})`);
}
