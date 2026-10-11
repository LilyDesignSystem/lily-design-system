import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import nunjucks from "nunjucks";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const headlessRoot = path.resolve(
  projectRoot,
  "..",
  "lily-design-system-nunjucks-headless",
);
// The helper packages are top-level subprojects (one per package, since
// 2026-10-10), so their templates resolve from the repository root, e.g.
// "lily-design-system-nunjucks-theme-picker/dist/theme-picker.njk".
const helpersRoot = path.resolve(projectRoot, "..");

export default function (eleventyConfig) {
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader([
      path.join(projectRoot, "src"),
      path.join(projectRoot, "src", "_includes"),
      headlessRoot,
      helpersRoot,
    ]),
    {
      autoescape: true,
      throwOnUndefined: false,
      trimBlocks: true,
      lstripBlocks: true,
    },
  );

  eleventyConfig.setLibrary("njk", env);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // The 45 reference themes (synced from the repo root by bin/sync) and
  // the picker client runtimes, vendored from the top-level helper packages.
  // The pickers import the shared listbox module by its package name, which
  // the import map in layouts/base.njk points at the copy served here.
  eleventyConfig.addPassthroughCopy({ "src/themes": "themes" });
  const vendored = {
    "../lily-design-system-nunjucks-listbox-behavior/listbox-behavior.client.js":
      "assets/js/listbox-behavior.client.js",
    "../lily-design-system-nunjucks-theme-picker/theme-picker.client.js":
      "assets/js/theme-picker.client.js",
    "../lily-design-system-nunjucks-locale-picker/dist/index.js":
      "assets/js/locale-picker.client.js",
    "../lily-design-system-nunjucks-text-size-picker/text-size-picker.client.js":
      "assets/js/text-size-picker.client.js",
  };
  // A passthrough copy skips a missing source without a word, which would
  // ship a site whose pickers silently never open. dist/index.js needs
  // `pnpm run build` in lily-design-system-nunjucks-locale-picker first.
  const missing = Object.keys(vendored).filter(
    (from) => !existsSync(path.resolve(projectRoot, from)),
  );
  if (missing.length > 0) {
    throw new Error(`.eleventy.js: missing picker scripts (build the helper packages first): ${missing.join(", ")}`);
  }
  eleventyConfig.addPassthroughCopy(vendored);

  eleventyConfig.addFilter("kebabToCamel", (s) =>
    s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()),
  );

  eleventyConfig.addFilter("kebabToTitle", (s) =>
    s
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
