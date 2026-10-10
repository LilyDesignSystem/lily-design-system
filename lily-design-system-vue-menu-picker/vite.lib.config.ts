import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Library build: compiles index.ts (a Vue SFC plus helpers) into one ESM
// bundle at dist/index.js. Every `dependencies` and `peerDependencies`
// entry in package.json (vue, @lilydesignsystem/*) stays external, so a
// consumer dedupes on its own vue and a sibling package's source is never
// inlined; its bare import stays for a real install to resolve. Type
// declarations come from vue-tsc (see build.mjs).
const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf8"));
const external = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})];

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: { external },
  },
});
