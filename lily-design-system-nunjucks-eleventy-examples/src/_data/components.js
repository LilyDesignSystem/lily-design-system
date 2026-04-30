import { readdirSync, existsSync, statSync } from "node:fs";
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
    }));
}

export default scan();
