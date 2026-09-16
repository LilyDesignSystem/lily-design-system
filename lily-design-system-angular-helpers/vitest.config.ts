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
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-angular-*/**/*.spec.ts"],
  },
});
