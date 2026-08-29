import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const headlessComponents = path.resolve(
  here,
  "..",
  "..",
  "..",
  "lily-design-system-nunjucks-headless",
  "components",
);
const categoriesTsv = path.resolve(here, "..", "..", "..", "components-categories.tsv");

// slug -> { tag, category } from the root canonical
// components-categories.tsv (bin/generate-component-categories), same
// source every other example app's registry reads for plan P6-T5's
// category + suffix-pattern /components search filters.
function loadCategories() {
  const map = {};
  if (!existsSync(categoriesTsv)) return map;
  for (const line of readFileSync(categoriesTsv, "utf-8").split("\n")) {
    if (!line.trim()) continue;
    const [slug, tag, category] = line.split("\t");
    map[slug] = { tag, category };
  }
  return map;
}

function kebabToTitle(s) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function kebabToCamel(s) {
  return s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function scan() {
  if (!existsSync(headlessComponents)) {
    return [];
  }
  const categories = loadCategories();
  return readdirSync(headlessComponents)
    .filter((name) => {
      const p = path.join(headlessComponents, name);
      if (!statSync(p).isDirectory()) return false;
      return existsSync(path.join(p, "macro.njk"));
    })
    .sort()
    .map((name) => ({
      kebab: name,
      title: kebabToTitle(name),
      macro: kebabToCamel(name),
      tag: categories[name]?.tag || "",
      category: categories[name]?.category || "content",
    }));
}

export default scan();
