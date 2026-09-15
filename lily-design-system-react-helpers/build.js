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

const packages = fs
  .readdirSync(root, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      entry.name.startsWith("lily-design-system-react-") &&
      fs.existsSync(path.join(root, entry.name, "index.ts")),
  )
  .map((entry) => entry.name)
  .sort();

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

for (const pkg of packages) {
  execFileSync(
    tsupBin,
    [
      path.join(pkg, "index.ts"),
      "--format",
      "esm",
      "--dts",
      "--out-dir",
      path.join(pkg, "dist"),
      ...externalArgs,
    ],
    { cwd: root, stdio: "inherit" },
  );
  console.log(`built ${pkg}/dist`);
}
