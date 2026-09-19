#!/usr/bin/env node
// Build each publishable helper sub-package's `dist/` with tsup.
//
// tsup runs from this catalog root (not each package's own directory), so
// its default "treat a package's own `dependencies` as external" detection
// never sees picker-bar's `package.json` — without an explicit `--external`
// it bundles a sibling package's whole compiled source into picker-bar's
// own dist/index.js instead of leaving the bare import for a real install
// to resolve. Every sibling package name is discovered and passed as
// `--external` to every build (a no-op for a package that doesn't import
// it), so this generalises to any future package that depends on another
// one in this catalog, not just picker-bar's four.

import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const packageDirs = fs
  .readdirSync(root, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      entry.name.startsWith("lily-design-system-react-") &&
      fs.existsSync(path.join(root, entry.name, "index.ts")),
  )
  .map((entry) => entry.name)
  // Alphabetical, except picker-bar always sorts last: its dts build
  // resolves each sibling picker's *type declarations*, which only
  // exist once that sibling's own build has already run. Alphabetical
  // order alone put it before theme-picker/share-picker/text-size-picker
  // on a from-scratch build (no pre-existing dist/ anywhere) -- fine
  // locally once any prior build had left their dist/ on disk, but a
  // hard failure on a genuinely clean checkout (confirmed in CI).
  .sort((a, b) => {
    const aBar = a.endsWith("-picker-bar");
    const bBar = b.endsWith("-picker-bar");
    if (aBar !== bBar) return aBar ? 1 : -1;
    return a.localeCompare(b);
  });

// The npm identity externalized below (what a sibling's import specifier
// actually resolves to) is each directory's package.json#name, not its
// directory name -- those diverged 2026-09-16 when the catalog moved to
// the @lilydesignsystem npm scope while directory names stayed put.
const packages = packageDirs.map(
  (dir) => JSON.parse(fs.readFileSync(path.join(root, dir, "package.json"), "utf8")).name,
);

const externalArgs = [
  "--external",
  "react",
  "--external",
  "react-dom",
  ...packages.flatMap((pkg) => ["--external", pkg]),
];

const tsupBin = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsup.cmd" : "tsup",
);

for (const dir of packageDirs) {
  execFileSync(
    tsupBin,
    [
      path.join(dir, "index.ts"),
      "--format",
      "esm",
      "--dts",
      "--out-dir",
      path.join(dir, "dist"),
      ...externalArgs,
    ],
    { cwd: root, stdio: "inherit" },
  );
  console.log(`built ${dir}/dist`);
}
