import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// Standalone test harness for the Vue helpers catalog. Each helper
// subproject (e.g. @lilydesignsystem/vue-theme-picker) keeps its own
// `*.test.ts` next to its component; vitest discovers them all.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // @lilydesignsystem/vue-picker-bar depends on these four sibling
      // packages the same way a real consumer would (declared as
      // regular npm `dependencies`, resolved from the registry once
      // published). This catalog has no pnpm workspace linking (no
      // `packages:` glob in pnpm-workspace.yaml), so nothing installs
      // them into node_modules locally — these aliases point the bare
      // specifiers at each sibling's already-built `dist/` for local
      // dev/test only. Not read by the library build: picker-bar's own
      // dist keeps the bare imports (see vite.lib.config.ts's matching
      // `external` entries), which real installs resolve normally.
      "@lilydesignsystem/vue-theme-picker": fileURLToPath(
        new URL(
          "./lily-design-system-vue-theme-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/vue-locale-picker": fileURLToPath(
        new URL(
          "./lily-design-system-vue-locale-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/vue-text-size-picker": fileURLToPath(
        new URL(
          "./lily-design-system-vue-text-size-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/vue-share-picker": fileURLToPath(
        new URL(
          "./lily-design-system-vue-share-picker/dist/index.js",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.js"],
    include: ["lily-design-system-vue-*/**/*.test.ts"],
  },
});
