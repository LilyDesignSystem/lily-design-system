import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Standalone test harness for the HTML (web component) helpers catalog.
// Each helper subproject (e.g. @lilydesignsystem/web-components-theme-picker)
// keeps its own `*.test.ts` next to its custom-element class; vitest
// discovers them all. jsdom provides customElements + DOM.
export default defineConfig({
  resolve: {
    alias: {
      // @lilydesignsystem/web-components-picker-bar depends on these
      // four sibling packages the same way a real consumer would
      // (declared as regular npm `dependencies`, resolved from the
      // registry once published). This catalog has no pnpm workspace
      // linking (no `packages:` glob in pnpm-workspace.yaml), so
      // nothing installs them into node_modules locally — these
      // aliases point the bare specifiers at each sibling's
      // already-built `dist/` for local dev/test only. Not read by the
      // tsup build: picker-bar's own dist keeps the bare imports,
      // which real installs resolve normally.
      "@lilydesignsystem/web-components-theme-picker": fileURLToPath(
        new URL(
          "./lily-design-system-web-components-theme-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/web-components-locale-picker": fileURLToPath(
        new URL(
          "./lily-design-system-web-components-locale-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/web-components-text-size-picker": fileURLToPath(
        new URL(
          "./lily-design-system-web-components-text-size-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/web-components-share-picker": fileURLToPath(
        new URL(
          "./lily-design-system-web-components-share-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      // @lilydesignsystem/web-components-gantt-chart composes
      // date-time-picker twice per edit session (start/end) — the same
      // local-dev/test-only aliasing as the picker-bar deps above.
      "@lilydesignsystem/web-components-date-time-picker": fileURLToPath(
        new URL(
          "./lily-design-system-web-components-date-time-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      // The pickers now depend on the *headless* catalog's <lily-icon-button>
      // for their trigger button (see its CHANGELOG entry, 2026-09-21) — the
      // first cross-catalog dependency here, same shape as the sibling
      // aliases above but pointing one level up at a sibling top-level
      // directory rather than a nested helper package.
      "@lilydesignsystem/web-components-headless": fileURLToPath(
        new URL(
          "../lily-design-system-web-components-headless/dist/index.js",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-web-components-*/**/*.test.ts"],
  },
});
