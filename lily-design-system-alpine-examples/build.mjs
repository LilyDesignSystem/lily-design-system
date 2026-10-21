// Builds the Alpine.js examples site into dist/: a home page, /components/ (every catalog component, searchable),
// /components/{slug}/ (a live demo, its markup and links), /helpers/ and one page per helper. No framework runtime: the
// pages are static HTML, Alpine is bundled once into /assets/app.js, and the themes are copied from the repo's themes/.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { HELPERS } from "./src/helper-demos.mjs";
import { REPO, catalog, demoOf, esc, here, markupOf, snippet, top } from "./lib.mjs";

export { catalog, demoOf, markupOf, snippet };

const label = (slug) => slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

function shell({ title, heading, main, description }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — Lily Design System (Alpine.js)</title>
<meta name="description" content="${esc(description ?? "Lily Design System components with Alpine.js.")}">
<link rel="stylesheet" href="/assets/app-shell.css">
<script src="/assets/themes.js"></script>
<script src="/assets/theme-boot.js"></script>
</head>
<body>
<a class="skip-link" href="#main-content">Skip to main content</a>
<header class="site-header" aria-label="Site header">
  <h1 id="page-heading">${esc(heading)}</h1>
  <nav class="site-nav" aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/components/">Components</a></li>
      <li><a href="/helpers/">Helpers</a></li>
    </ul>
  </nav>
  <div class="site-header-pickers" x-data="lilyThemeSelect()">
    <label>Theme
      <select x-model="value" @change="choose()">
        <template x-for="t in themes" :key="t.slug"><option :value="t.slug" :selected="t.slug === value" x-text="t.label"></option></template>
      </select>
    </label>
  </div>
</header>
<main id="main-content" class="page-wrapper">
${main}
</main>
<footer class="site-footer" aria-label="Site footer">
  <p>Lily™ and Lily Design System™ are trademarks.</p>
</footer>
<script type="module" src="/assets/app.js"></script>
</body>
</html>
`;
}

const write = (out, path, html) => {
  const file = join(out, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

function homePage(components) {
  return shell({
    title: "Home",
    heading: "Lily Design System with Alpine.js",
    description: "Every Lily component as semantic HTML with Alpine.js behaviour, and four helpers built on it.",
    main: `<p>All ${components.length} Lily components as annotated HTML snippets plus one Alpine.js plugin: semantic elements, ARIA, class hooks and keyboard behaviour, with no CSS of their own. The look comes from a reference theme; choose one in the header.</p>
<ul>
  <li><a href="/components/">Components</a> — every component in the catalog, searchable, each with a live demo and its markup.</li>
  <li><a href="/helpers/">Helpers</a> — a data grid, a kanban board, a calendar and a Gantt chart.</li>
</ul>
<p>The package is <a href="${REPO}/lily-design-system-alpine-headless"><code>@lilydesignsystem/alpine-headless</code></a>; its helpers are <code>alpine-data-grid</code>, <code>alpine-kanban-board</code>, <code>alpine-calendar</code> and <code>alpine-gantt-chart</code>.</p>`,
  });
}

function componentsIndex(components) {
  const items = components
    .map((c) => `    <li data-text="${esc(`${c.name} ${c.description}`)}" x-show="matches($el.dataset.text)"><a href="/components/${c.slug}/">${esc(c.name)}</a> <span>${esc(c.description)}</span></li>`)
    .join("\n");
  return shell({
    title: "Components",
    heading: "Components",
    description: `All ${components.length} Lily components with Alpine.js.`,
    main: `<div x-data="lilyComponentFilter()">
  <label for="component-search">Search components</label>
  <input id="component-search" type="search" x-model="query" autocomplete="off">
  <p role="status" aria-live="polite"><span x-text="count()">${components.length}</span> of ${components.length} components</p>
  <ul class="component-index">
${items}
  </ul>
</div>`,
  });
}

function componentPage(c) {
  const markup = snippet(c.slug);
  const demo = demoOf(c.name, markup, c.slug);
  return shell({
    title: c.name,
    heading: c.name,
    description: c.description,
    main: `<p>${esc(c.description)}.</p>
<h2>Demo</h2>
<div class="demo" id="demo">
${demo}
</div>
<h2>Markup</h2>
<pre tabindex="0"><code>${esc(markup)}</code></pre>
<h2>More</h2>
<ul>
  <li><a href="${REPO}/components/${c.slug}">Specification and guidance for ${esc(c.name)}</a></li>
  <li><a href="${REPO}/lily-design-system-alpine-headless/components/${c.slug}.html">The snippet</a></li>
  <li><a href="/components/">All components</a></li>
</ul>`,
  });
}

function helpersIndex() {
  const items = Object.entries(HELPERS)
    .map(([slug, h]) => `  <li><a href="/helpers/${slug}/">${esc(h.title)}</a> — ${esc(h.description)}</li>`)
    .join("\n");
  return shell({
    title: "Helpers",
    heading: "Helpers",
    description: "Alpine.js helpers: data grid, kanban board, calendar and Gantt chart.",
    main: `<p>Each helper is an Alpine plugin plus a snippet, built on the same shared logic as the other frameworks' helpers. Every string below is supplied by this page, not the helper.</p>
<ul>
${items}
</ul>`,
  });
}

function helperPage(slug, h) {
  const markup = markupOf(readFileSync(join(top, h.package, "snippet.html"), "utf8"));
  return shell({
    title: h.title,
    heading: h.title,
    description: h.description,
    main: `<p>${esc(h.description)}</p>
<script>${h.script}</script>
<div class="demo" id="demo">
${markup}
</div>
<h2>Options</h2>
<pre tabindex="0"><code>${esc(h.script.trim())}</code></pre>
<h2>Markup</h2>
<pre tabindex="0"><code>${esc(markup)}</code></pre>
<p><a href="${REPO}/${h.package}">${esc(h.package)}</a> · <a href="/helpers/">All helpers</a></p>`,
  });
}

/** Build the whole site into `out` (default dist/). Returns the number of pages written. */
export async function buildSite(out = join(here, "dist")) {
  rmSync(out, { recursive: true, force: true });
  const components = catalog();
  const themes = readdirSync(join(top, "themes")).filter((f) => f.endsWith(".css")).map((f) => f.slice(0, -4)).sort();

  mkdirSync(join(out, "assets"), { recursive: true });
  cpSync(join(here, "assets"), join(out, "assets"), { recursive: true });
  cpSync(join(top, "themes"), join(out, "themes"), { recursive: true, filter: (src) => !src.includes("/tokens") });
  writeFileSync(join(out, "assets", "themes.js"), `window.lilyThemes = ${JSON.stringify(themes.map((slug) => ({ slug, label: label(slug) })))};\n`);
  await build({
    entryPoints: [join(here, "src", "app.js")],
    bundle: true,
    format: "esm",
    minify: true,
    outfile: join(out, "assets", "app.js"),
    logLevel: "warning",
  });

  let pages = 0;
  const put = (path, html) => { write(out, path, html); pages += 1; };
  put("index.html", homePage(components));
  put("components/index.html", componentsIndex(components));
  for (const c of components) {
    if (!existsSync(join(top, "lily-design-system-alpine-headless", "components", `${c.slug}.html`))) throw new Error(`no Alpine snippet for ${c.slug}`);
    put(`components/${c.slug}/index.html`, componentPage(c));
  }
  put("helpers/index.html", helpersIndex());
  for (const [slug, h] of Object.entries(HELPERS)) put(`helpers/${slug}/index.html`, helperPage(slug, h));
  return pages;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pages = await buildSite();
  console.log(`built ${pages} pages into dist/`);
}
