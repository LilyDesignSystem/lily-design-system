// Node helper over the component snippet files. The package's real
// payload is components/*.html — annotated semantic-HTML snippets a
// consumer copies or templates; this entry point just makes them easy
// to locate and read from build tooling. Browser bundles never need it.
"use strict";
const path = require("path");
const fs = require("fs");

/** Absolute path to the directory holding the 491 component .html files. */
const componentsDir = path.join(__dirname, "components");

/** Read one component's annotated HTML snippet by kebab-case slug. */
function readComponent(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`invalid component slug: ${slug}`);
  }
  return fs.readFileSync(path.join(componentsDir, slug + ".html"), "utf8");
}

/** List every available component slug, sorted. */
function listComponents() {
  return fs
    .readdirSync(componentsDir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.slice(0, -5))
    .sort();
}

module.exports = { componentsDir, readComponent, listComponents };
