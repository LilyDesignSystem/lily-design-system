import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

// Library build for one Vue helper sub-package.
//
// The catalog root `build` script invokes this config once per
// publishable sub-package, passing the package directory name via the
// `LILY_PKG` environment variable. It compiles the sub-package's
// `index.ts` (which re-exports a Vue SFC plus helper functions) into a
// single ESM bundle at `<pkg>/dist/index.js`, with `vue` left external
// so consumers dedupe on their own copy. Type declarations are emitted
// separately by `vue-tsc` (see the root `build` script).
const pkg = process.env.LILY_PKG;
if (!pkg) {
  throw new Error(
    "vite.lib.config.ts requires the LILY_PKG env var (the sub-package directory name).",
  );
}

const pkgDir = resolve(__dirname, pkg);

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: resolve(pkgDir, "dist"),
    emptyOutDir: true,
    lib: {
      entry: resolve(pkgDir, "index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["vue"],
    },
  },
});
