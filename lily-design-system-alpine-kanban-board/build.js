#!/usr/bin/env node
// Build dist/ in two steps. tsup bundles the JavaScript: run from this package's own directory, it treats every
// `dependencies` entry in package.json (and its subpaths) as external, so a sibling package or the headless library is never
// bundled in. rollup-plugin-dts bundles the declarations into one dist/index.d.ts. TypeScript 7's native compiler has no
// JavaScript API, so tsup's own --dts cannot run; rollup-plugin-dts uses the TypeScript 6 API package
// (@typescript/typescript6) for that step, and `npm run check` type-checks with TypeScript 7.

import { execFileSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { rollup } from "rollup";
import { dts } from "rollup-plugin-dts";

const root = path.dirname(fileURLToPath(import.meta.url));
const tsupBin = path.join(
    root,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "tsup.cmd" : "tsup",
);

execFileSync(
    tsupBin,
    ["index.ts", "--format", "esm", "--out-dir", "dist", "--tsconfig", "tsconfig.json"],
    {
        cwd: root,
        stdio: "inherit",
    },
);

// A bare import (alpinejs, a sibling package) stays an import; only this package's own files are bundled.
const bundle = await rollup({
    input: path.join(root, "index.ts"),
    plugins: [dts({ tsconfig: path.join(root, "tsconfig.json") })],
    external: (id) => !id.startsWith(".") && !path.isAbsolute(id),
});
await bundle.write({ file: path.join(root, "dist", "index.d.ts"), format: "es" });
await bundle.close();
console.log("built dist");
