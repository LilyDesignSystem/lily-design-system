import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Standalone test harness for the React helpers catalog. Each helper
// subproject (e.g. @lilydesignsystem/react-theme-picker) keeps its
// own `*.test.tsx` next to its component; vitest discovers them all.
export default defineConfig({
  plugins: [react()],
  resolve: {
    // The headless catalog's dist/index.js (aliased below to a raw file
    // path outside this workspace) has its own separate node_modules/react
    // install one directory up. Without forcing both to resolve to this
    // workspace's own react/react-dom, React mounts two copies and every
    // hook call inside the headless components throws "Invalid hook call".
    dedupe: ["react", "react-dom"],
    alias: {
      // @lilydesignsystem/react-picker-bar depends on these four sibling
      // packages the same way a real consumer would (declared as regular
      // npm `dependencies`, resolved from the registry once published).
      // This catalog has no pnpm workspace linking (no `packages:` glob in
      // pnpm-workspace.yaml), so nothing installs them into node_modules
      // locally — these aliases point the bare specifiers at each
      // sibling's already-built `dist/` for local dev/test only. Not read
      // by the tsup build: picker-bar's own dist keeps the bare imports,
      // which real installs resolve normally.
      "@lilydesignsystem/react-theme-picker": fileURLToPath(
        new URL(
          "./lily-design-system-react-theme-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/react-locale-picker": fileURLToPath(
        new URL(
          "./lily-design-system-react-locale-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/react-text-size-picker": fileURLToPath(
        new URL(
          "./lily-design-system-react-text-size-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      "@lilydesignsystem/react-share-picker": fileURLToPath(
        new URL(
          "./lily-design-system-react-share-picker/dist/index.js",
          import.meta.url,
        ),
      ),
      // @lilydesignsystem/react-{theme,locale,text-size,motion,share,date-time}-picker
      // depend on the *headless* catalog's IconButton/Listbox the same way a
      // real consumer would (a regular npm `dependency`). The headless
      // catalog lives one level up as a sibling top-level directory.
      "@lilydesignsystem/react-headless": fileURLToPath(
        new URL(
          "../lily-design-system-react-headless/dist/index.js",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-react-*/**/*.test.tsx"],
  },
});
