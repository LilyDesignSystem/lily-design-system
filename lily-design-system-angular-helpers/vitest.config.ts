import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

// Standalone test harness for the Angular helpers catalog. Each helper
// subproject (e.g. @lilydesignsystem/angular-theme-picker) keeps its
// own `*.component.spec.ts` next to its component; vitest discovers
// them all. Mirrors the angular-headless library harness.

export default defineConfig({
  plugins: [angular()],
  resolve: {
    // @lilydesignsystem/angular-headless is a separate top-level catalog
    // (its own package.json/pnpm install), unlike the four sibling
    // *-picker packages below (nested inside this catalog, sharing this
    // root's one node_modules). Crossing that install boundary means the
    // aliased headless FESM bundle's own `@angular/core` import resolves
    // to a DIFFERENT physical copy than this catalog's — same version,
    // separate pnpm-store path — which breaks Angular's DI: components
    // created from the two copies don't share the same injection-context
    // tracking, and instantiating a headless component (e.g. IconButton)
    // as a child of a helpers component throws NG0203
    // ("inputFunction() can only be used within an injection context").
    // `dedupe` forces every resolution of these packages, regardless of
    // which file imports them, to the one copy Vite finds first.
    dedupe: ["@angular/core", "@angular/common", "rxjs"],
    alias: {
      // @lilydesignsystem/angular-picker-bar depends on these four
      // sibling packages the same way a real consumer would (declared
      // as regular npm `dependencies`, resolved from the registry once
      // published). This catalog has no pnpm workspace linking (no
      // `packages:` glob in pnpm-workspace.yaml), so nothing installs
      // them into node_modules locally — these aliases point the bare
      // specifiers at each sibling's already-built ng-packagr `dist/`
      // for local dev/test only. Not read when picker-bar's own dist
      // is built: real installs resolve the bare imports from
      // node_modules via the `dependencies` in its package.json.
      // ng-packagr names a scoped entry point's FESM bundle by
      // stripping "@" and joining scope+name with a hyphen (no nested
      // directory) — confirmed by building each sibling after the
      // 2026-09-16 @lilydesignsystem rescope: `lilydesignsystem-
      // angular-theme-picker.mjs`, not `@lilydesignsystem/angular-
      // theme-picker.mjs`.
      "@lilydesignsystem/angular-theme-picker": fileURLToPath(
        new URL(
          "./lily-design-system-angular-theme-picker/dist/fesm2022/lilydesignsystem-angular-theme-picker.mjs",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/angular-locale-picker": fileURLToPath(
        new URL(
          "./lily-design-system-angular-locale-picker/dist/fesm2022/lilydesignsystem-angular-locale-picker.mjs",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/angular-text-size-picker": fileURLToPath(
        new URL(
          "./lily-design-system-angular-text-size-picker/dist/fesm2022/lilydesignsystem-angular-text-size-picker.mjs",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/angular-share-picker": fileURLToPath(
        new URL(
          "./lily-design-system-angular-share-picker/dist/fesm2022/lilydesignsystem-angular-share-picker.mjs",
          import.meta.url,
        ),
      ),
      // @lilydesignsystem/angular-gantt-chart depends on this sibling
      // helper the same way picker-bar depends on its own four siblings
      // (see the note above) — used twice per edit session, for a
      // task's start and end date.
      "@lilydesignsystem/angular-date-time-picker": fileURLToPath(
        new URL(
          "./lily-design-system-angular-date-time-picker/dist/fesm2022/lilydesignsystem-angular-date-time-picker.mjs",
          import.meta.url,
        ),
      ),
      // @lilydesignsystem/angular-theme-picker (and the other migrated
      // pickers) depend on the *headless* catalog's IconButton/Listbox
      // the same way a real consumer would (a regular npm `dependency`,
      // resolved from the registry once published) — porting the
      // composition refactor already done for the Svelte catalog. The
      // headless catalog lives one level up as a sibling top-level
      // directory, not nested inside this one.
      "@lilydesignsystem/angular-headless": fileURLToPath(
        new URL(
          "../lily-design-system-angular-headless/dist/fesm2022/lilydesignsystem-angular-headless.mjs",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-angular-*/**/*.spec.ts"],
  },
});
