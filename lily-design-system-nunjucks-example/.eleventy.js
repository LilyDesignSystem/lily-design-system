import { fileURLToPath } from "node:url";
import path from "node:path";
import nunjucks from "nunjucks";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const headlessRoot = path.resolve(
  projectRoot,
  "..",
  "lily-design-system-nunjucks-headless",
);

export default function (eleventyConfig) {
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader([
      path.join(projectRoot, "src"),
      path.join(projectRoot, "src", "_includes"),
      headlessRoot,
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
