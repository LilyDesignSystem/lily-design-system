import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Standalone test harness for the HTML (web component) helpers catalog.
// Each helper subproject (e.g. lily-design-system-html-theme-picker)
// keeps its own `*.test.ts` next to its custom-element class; vitest
// discovers them all. jsdom provides customElements + DOM.
export default defineConfig({
  resolve: {
    alias: {
      // lily-design-system-html-picker-bar depends on these four sibling
      // packages the same way a real consumer would (declared as regular
      // npm `dependencies`, resolved from the registry once published).
      // This catalog has no workspace linking, so nothing installs them
      // into node_modules locally — these aliases point the bare
      // specifiers at each sibling's already-built `dist/` for local
      // dev/test only. Not read by the catalog `build` script: picker-bar's
      // own dist keeps the bare imports, which real installs resolve.
      "lily-design-system-html-theme-picker": fileURLToPath(
        new URL(
          "./lily-design-system-html-theme-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "lily-design-system-html-locale-picker": fileURLToPath(
        new URL(
          "./lily-design-system-html-locale-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "lily-design-system-html-text-size-picker": fileURLToPath(
        new URL(
          "./lily-design-system-html-text-size-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "lily-design-system-html-share-picker": fileURLToPath(
        new URL(
          "./lily-design-system-html-share-picker/dist/index.js",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-html-*/**/*.test.ts"],
  },
});
