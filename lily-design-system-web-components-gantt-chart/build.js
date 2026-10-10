#!/usr/bin/env node
// Build dist/ with tsup. Run from this package's own directory, tsup treats
// every `dependencies` entry in package.json (and its subpaths) as external,
// so a sibling package or the headless library is never bundled in; the bare
// import stays for a real install to resolve. tsconfig.json's `paths` let the
// DTS step find those dependencies' types locally (build siblings first).

import { execFileSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const tsupBin = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "tsup.cmd" : "tsup");

execFileSync(tsupBin, ["index.ts", "--format", "esm", "--dts", "--out-dir", "dist", "--tsconfig", "tsconfig.json"], {
  cwd: root,
  stdio: "inherit",
});
console.log("built dist");
