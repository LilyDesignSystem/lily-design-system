import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

// Standalone test harness for the Svelte helpers catalog. Each helper
// subproject (e.g. @lilydesignsystem/svelte-theme-picker) keeps its
// own `*.test.ts` next to its component; vitest discovers them all.
export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  resolve: {
    alias: {
      // @lilydesignsystem/svelte-picker-bar depends on these four sibling
      // packages the same way a real consumer would (declared as regular
      // npm `dependencies`, resolved from the registry once published).
      // This catalog has no pnpm workspace linking (no `packages:` glob in
      // pnpm-workspace.yaml), so nothing installs them into node_modules
      // locally — these aliases point the bare specifiers at each
      // sibling's already-built `dist/` for local dev/test only. Not read
      // by svelte-package: picker-bar's own dist keeps the bare imports,
      // which real installs resolve normally.
      "@lilydesignsystem/svelte-theme-picker": fileURLToPath(
        new URL(
          "./lily-design-system-svelte-theme-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/svelte-locale-picker": fileURLToPath(
        new URL(
          "./lily-design-system-svelte-locale-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/svelte-text-size-picker": fileURLToPath(
        new URL(
          "./lily-design-system-svelte-text-size-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/svelte-share-picker": fileURLToPath(
        new URL(
          "./lily-design-system-svelte-share-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      // @lilydesignsystem/svelte-data-grid depends on the *headless*
      // catalog's DataTable family the same way a real consumer would (a
      // regular npm `dependency`, resolved from the registry once
      // published) — the first helper to depend across catalogs rather
      // than on a sibling helper. The headless catalog lives one level up
      // as a sibling top-level directory, not nested inside this one.
      "@lilydesignsystem/svelte-headless": fileURLToPath(
        new URL(
          "../lily-design-system-svelte-headless/dist/index.js",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.js"],
    include: ["lily-design-system-svelte-*/**/*.test.ts"],
  },
});
