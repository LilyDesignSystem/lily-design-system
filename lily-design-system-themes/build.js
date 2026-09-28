#!/usr/bin/env node
// Packages the canonical root themes/*.css into this package's dist/.
// The root themes/ directory (not this package) is the canonical
// source — see AGENTS/theme.md and bin/sync, which rsyncs the same
// files into every example app's static assets. This script is the
// npm-publish equivalent of that rsync: it never edits a theme, only
// copies it.

import { readdirSync, mkdirSync, copyFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "..", "themes");
const dist = join(here, "dist");

if (existsSync(dist)) rmSync(dist, { recursive: true });
mkdirSync(dist, { recursive: true });

const files = readdirSync(src).filter((f) => f.endsWith(".css"));
if (files.length === 0) {
    throw new Error(`no .css files found in ${src}`);
}
for (const file of files) {
    copyFileSync(join(src, file), join(dist, file));
}

console.log(`build.js: copied ${files.length} theme stylesheets into dist/`);
