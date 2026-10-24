#!/usr/bin/env node
// Build dist/ with tsup. Run from this package's own directory, tsup
// treats every `dependencies` and `peerDependencies` entry in package.json
// (react, react-dom, @lilydesignsystem/*) as external, so a sibling
// package's source is never bundled in; its bare import stays for a real
// install to resolve. Type declarations for sibling packages resolve
// through tsconfig.json's `paths` to their built dist/, so build those first.

import { execFileSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const tsupBin = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "tsup.cmd" : "tsup");

execFileSync(tsupBin, ["index.ts", "--format", "esm", "--dts", "--out-dir", "dist"], {
  cwd: root,
  stdio: "inherit",
});
console.log("built dist");
