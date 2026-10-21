// Node helper over the component snippet files. The package's real
// payload is components/*.html (annotated semantic HTML with Alpine
// directives) and lily-alpine.js (the Alpine plugin); this entry point
// just makes the snippets easy to locate and read from build tooling.
// Browser bundles never need it.
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** Absolute path to the directory holding the component .html files. */
export const componentsDir = join(dirname(fileURLToPath(import.meta.url)), "components");

/** Read one component's annotated HTML snippet by kebab-case slug. */
export function readComponent(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`invalid component slug: ${slug}`);
  }
  return readFileSync(join(componentsDir, slug + ".html"), "utf8");
}

/** List every available component slug, sorted. */
export function listComponents() {
  return readdirSync(componentsDir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.slice(0, -5))
    .sort();
}
