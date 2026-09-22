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
      // "vue" dedupes on the consumer's own copy. The four picker
      // packages are external too, for @lilydesignsystem/vue-picker-bar
      // specifically: it depends on them as ordinary npm `dependencies`
      // (see its own package.json), not vendored source, so its built
      // dist/index.js must keep those bare imports rather than bundling
      // each sibling's full implementation into every picker-bar
      // install. Harmless for every other sub-package here, which
      // doesn't import any of these specifiers.
      external: [
        "vue",
        "@lilydesignsystem/vue-theme-picker",
        "@lilydesignsystem/vue-locale-picker",
        "@lilydesignsystem/vue-text-size-picker",
        "@lilydesignsystem/vue-share-picker",
        // theme-picker, locale-picker, text-size-picker, motion-picker,
        // share-picker, date-time-picker, kanban-board, and gantt-chart
        // all depend on this now (IconButton/Listbox, or the KanbanTable/
        // GanttTable families) — external for the same reason as the
        // four sibling pickers above: keep the bare import in each
        // package's own dist rather than inlining the whole headless
        // bundle into every install.
        "@lilydesignsystem/vue-headless",
        // gantt-chart depends on this sibling helper too (composed
        // twice per edit session, for a task's start/end date) — same
        // external reasoning.
        "@lilydesignsystem/vue-date-time-picker",
      ],
    },
  },
});
