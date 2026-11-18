#!/usr/bin/env node
// Build @lilydesignsystem/solid-search-picker:
//   1. tsc -p tsconfig.build.json: the JSX kept as JSX, with declarations, in dist/source, for the "solid" export
//      condition (a Solid app compiles it for the browser or the server).
//   2. Vite in library mode with @solidjs/vite-plugin: compiled for the browser, in dist/index.js, for any other bundler.
// solid-js, @solidjs/web and every @lilydesignsystem dependency stay external.
import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import solid from "@solidjs/vite-plugin";
import { build } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));
fs.rmSync(path.join(root, "dist"), { recursive: true, force: true });
execFileSync("npx", ["tsc", "-p", "tsconfig.build.json"], { cwd: root, stdio: "inherit" });
await build({
    root,
    configFile: false,
    logLevel: "warn",
    plugins: [solid()],
    build: {
        outDir: "dist",
        emptyOutDir: false,
        sourcemap: true,
        minify: false,
        lib: { entry: path.join(root, "index.ts"), formats: ["es"], fileName: () => "index.js" },
        rolldownOptions: {
            external: (id) => /^(solid-js|@solidjs\/web|@lilydesignsystem\/)/.test(id),
        },
    },
});
for (const artifact of ["index.js", "source/index.js", "source/index.d.ts"]) {
    const file = path.join(root, "dist", artifact);
    if (!fs.existsSync(file) || fs.statSync(file).size === 0)
        throw new Error(`expected a non-empty dist/${artifact}`);
}
console.log("build ok");
