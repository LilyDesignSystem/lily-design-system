#!/usr/bin/env node
// Build each publishable helper sub-package's `dist/` with tsup.
//
// Packages are discovered rather than listed (mirrors the Svelte
// catalog's own build.js): a hardcoded list silently skips any new
// helper. Each package's own `dependencies` (declared in its
// package.json — currently only @lilydesignsystem/html-picker-bar has
// any) are passed to tsup as `--external`, so a composed package's real
// npm dependency on a sibling package is left as a bare import in the
// built output rather than erroring (tsup/esbuild can't resolve it
// locally — nothing installs siblings into node_modules in this
// catalog) or being wrongly bundled (wrong for a package whose siblings
// are installed separately by the real consumer).

import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const packages = fs
  .readdirSync(root, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      entry.name.startsWith("lily-design-system-html-") &&
      fs.existsSync(path.join(root, entry.name, "index.ts")),
  )
  .map((entry) => entry.name)
  .sort();

const tsupBin = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsup.cmd" : "tsup",
);

if (packages.length === 0) {
  console.error("build: no helper packages discovered");
  process.exit(1);
}

for (const pkg of packages) {
  const pkgDir = path.join(root, pkg);
  const entry = path.join(pkgDir, "index.ts");
  const distDir = path.join(pkgDir, "dist");
  const pkgJson = JSON.parse(
    fs.readFileSync(path.join(pkgDir, "package.json"), "utf8"),
  );
  const deps = Object.keys(pkgJson.dependencies ?? {});

  console.log(`building ${pkg}`);
  const args = [entry, "--format", "esm", "--dts", "--out-dir", distDir];
  for (const dep of deps) args.push("--external", dep);
  // A package that depends on siblings (currently only picker-bar) needs
  // its own tsconfig `paths` so the DTS rollup step can resolve those
  // siblings' published types — scoped to this one invocation via
  // --tsconfig, never picked up as a catalog-wide default for the other
  // packages that have no such tsconfig.json of their own.
  const ownTsconfig = path.join(pkgDir, "tsconfig.json");
  if (fs.existsSync(ownTsconfig)) args.push("--tsconfig", ownTsconfig);
  execFileSync(tsupBin, args, { cwd: root, stdio: "inherit" });
}
