/// <reference types="vitest" />
import { defineConfig } from "vite";
import analog from "@analogjs/platform";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Build the prerender route list at config time so the SSG step emits
// every component-detail page plus the composed-page demos plus the
// top-level routes. The catalog is the canonical components.tsv at
// the repo root.

const TSV = resolve(__dirname, "..", "components.tsv");
const slugs = readFileSync(TSV, "utf8")
  .split("\n")
  .map((line) => line.split("\t")[0])
  .filter(Boolean);

const composedPages = [
  "/contact-form",
  "/dashboard",
  "/dialog-flow",
  "/file-upload-form",
  "/navigation-and-menus",
  "/page-layout",
  "/rating-and-feedback",
  "/search-and-filter",
  "/settings-page",
  "/tabbed-interface",
  "/task-management",
  "/timeline-and-cards",
];

const prerenderRoutes = [
  "/",
  "/components",
  ...slugs.map((s) => `/components/${s}`),
  ...composedPages,
];

export default defineConfig(() => ({
  build: {
    target: ["es2022"],
    outDir: "dist/client",
  },
  resolve: {
    mainFields: ["module"],
  },
  // Keep Analog's router module out of dep pre-bundling/optimisation so the
  // `ANALOG_ROUTE_FILES = {}` placeholder reaches the analog-glob-routes
  // transform un-reformatted; otherwise its brittle string replace misses and
  // the file-based routes resolve to an empty set.
  optimizeDeps: {
    exclude: ["@analogjs/router"],
  },
  ssr: {
    noExternal: ["@analogjs/router"],
  },
  plugins: [
    analog({
      prerender: {
        routes: prerenderRoutes,
      },
    }),
  ],
}));
