import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

// Library build for the published package. `vue` stays external so the
// consumer's own Vue instance is used — bundling a second copy breaks
// provide/inject and instanceof checks across the boundary.
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL("./index.ts", import.meta.url)),
      formats: ["es"],
      fileName: () => "index.mjs",
    },
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: { external: ["vue", "aria-query"] },
  },
});
