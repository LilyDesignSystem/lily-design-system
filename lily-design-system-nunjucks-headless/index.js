// Node helper over the macro templates. The package's real payload is
// components/{slug}/macro.njk — add `templatesDir` to your nunjucks
// FileSystemLoader search path and import macros from
// "{slug}/macro.njk" inside your templates.
"use strict";
const path = require("path");
const fs = require("fs");

/** Absolute path to add to the nunjucks loader search path. */
const templatesDir = path.join(__dirname, "components");

/** Loader-relative template path for one component's macro file. */
function macroPath(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`invalid component slug: ${slug}`);
  }
  return slug + "/macro.njk";
}

/** List every available component slug, sorted. */
function listComponents() {
  return fs
    .readdirSync(templatesDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

module.exports = { templatesDir, macroPath, listComponents };
