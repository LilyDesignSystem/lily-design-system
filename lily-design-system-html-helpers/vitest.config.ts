import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Standalone test harness for the HTML (web component) helpers catalog.
// Each helper subproject (e.g. @lilydesignsystem/html-theme-picker)
// keeps its own `*.test.ts` next to its custom-element class; vitest
// discovers them all. jsdom provides customElements + DOM.
export default defineConfig({
  resolve: {
    alias: {
      // @lilydesignsystem/html-picker-bar depends on these four sibling
      // packages the same way a real consumer would (declared as regular
      // npm `dependencies`, resolved from the registry once published).
      // This catalog has no workspace linking, so nothing installs them
      // into node_modules locally — these aliases point the bare
      // specifiers at each sibling's already-built `dist/` for local
      // dev/test only. Not read by the catalog `build` script: picker-bar's
      // own dist keeps the bare imports, which real installs resolve.
      "@lilydesignsystem/html-theme-picker": fileURLToPath(
        new URL(
          "./lily-design-system-html-theme-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/html-locale-picker": fileURLToPath(
        new URL(
          "./lily-design-system-html-locale-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/html-text-size-picker": fileURLToPath(
        new URL(
          "./lily-design-system-html-text-size-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/html-share-picker": fileURLToPath(
        new URL(
          "./lily-design-system-html-share-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      // @lilydesignsystem/html-theme-picker (and the other migrated
      // pickers) depend on the *headless* catalog's ListboxController —
      // a real npm `dependency`, resolved from the registry once
      // published — porting the same headless-composition refactor
      // already done for the other framework catalogs. The headless
      // catalog lives one level up as a sibling top-level directory, and
      // unlike the four sibling helper packages above, it ships no
      // dist/ at all (no build step; components/ IS the published
      // source), so this points straight at the source file.
      "@lilydesignsystem/html-headless/components/listbox-controller.js": fileURLToPath(
        new URL(
          "../lily-design-system-html-headless/components/listbox-controller.js",
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
