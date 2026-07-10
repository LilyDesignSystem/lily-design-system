# Lily Design System™ — Nunjucks Helpers

A catalog of opinionated, reusable Nunjucks 3 helper packages that
sit alongside the headless [`lily-design-system-nunjucks-headless`](../lily-design-system-nunjucks-headless/)
library. Where the headless library ships pure macro primitives,
these helpers wrap a complete lifecycle (selection + persistence +
DOM application) for one small, common job.

## Catalog

| Helper                                                                                      | Purpose                                                          |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`lily-design-system-nunjucks-theme-select`](./lily-design-system-nunjucks-theme-select/)   | Pick a visual theme; dynamic CSS load + `data-theme` swap.       |
| [`lily-design-system-nunjucks-locale-select`](./lily-design-system-nunjucks-locale-select/) | Pick a BCP 47 locale; sets `lang` + `dir` on the document root.  |
| [`lily-design-system-nunjucks-text-size-select`](./lily-design-system-nunjucks-text-size-select/) | Pick a text size; sets `data-text-size` on the document root.    |

## The split: macro + client.js

Nunjucks is, fundamentally, a server-side / build-time template
language. Most Lily™ helpers in sibling framework catalogs (Svelte,
React, Vue, Angular) live as a single component that owns both
markup and runtime. The Nunjucks port deliberately **splits** that
into two files:

| File                       | Runs where                | Owns                                                  |
| -------------------------- | ------------------------- | ----------------------------------------------------- |
| `{kebab-name}.njk`         | Nunjucks render time      | Markup, ARIA, class hooks, `data-lily-*` hooks.       |
| `{kebab-name}.client.js`   | Browser (after page load) | Storage, attribute set, dynamic loading, change events. |

The macro emits a static native `<select>` with `data-lily-*`
attributes that describe the select's configuration; the companion ES module finds
those roots in the DOM at runtime and wires the apply lifecycle.
Consumers load the client.js once per page (typically via
`<script type="module">`) and call `autoInit()` to bind every select
present in the document.

This split exists because:

1. Nunjucks renders HTML. It cannot read `localStorage`, mutate
   `document.head`, or hook `change` events; those live in the
   browser.
2. Build-time renderers (Eleventy, plain `nunjucks.render`) produce
   static HTML that survives without a JS bundle — the macro alone
   ships a perfectly usable native `<select>`.
3. The runtime is a tiny ES module with zero framework dependency
   that any consumer can drop into their template.

## Conventions

Every helper subproject follows the same shape:

```
lily-design-system-nunjucks-<name>/
├── spec/index.md                  ← single source of truth (SDD)
├── AGENTS.md                ← AI-agent metadata pointer
├── CLAUDE.md                ← loads AGENTS.md
├── AGENTS/                  ← topic-by-topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── index.md                 ← comprehensive user guide
├── {kebab-name}.njk         ← macro file (camelCase macro inside)
├── {kebab-name}.client.js   ← runtime ES module
├── {kebab-name}.test.ts     ← vitest spec (one test per §7 acceptance)
├── CHANGELOG.md
├── docs/                    ← topic deep-dives
└── examples/                ← runnable .njk templates
```

The catalog parent shares its own `AGENTS/` and `AGENTS/shared/`
directories with conventions, testing, accessibility, and SSR rules,
plus the Lily-wide headless / i18n / theme principles ported from
the root canonical AGENTS files.

Shared design decisions across the catalog:

- **Nunjucks 3 macro** — camelCase macro name (Nunjucks does not
  allow hyphens in identifiers); kebab-case file path and CSS class
  hook.
- **Single `opts` parameter** — every macro accepts one options
  object, matching the upstream Nunjucks convention in the headless
  library.
- **Companion client.js** — runtime lifecycle (storage, navigator,
  link swap, attribute set) lives in a separate ES-module file the
  consumer loads once per page.
- **`data-lily-*` wiring** — the macro emits `data-lily-*`
  attributes the client.js uses to hook up event listeners and find
  its managed DOM nodes. No inline `<script>` tags.
- **Headless** — no bundled CSS, fonts, icons, or images. Consumer
  styles every visual aspect via a kebab-case class hook.
- **SSR-safe** — the macro is a pure template; the client.js guards
  every DOM read/write behind a `typeof document !== "undefined"`
  check.
- **i18n-clean** — every user-facing string comes from an `opts`
  key.
- **One job per helper** — each helper owns the entire lifecycle of
  one user-preference dimension (theme, language, etc.) and composes
  cleanly with the others.
- **Spec-driven** — every helper has a `spec/index.md` numbered with §
  references; tests assert against those numbers; docs link back.

## Differences from the headless library

The headless library mirrors the canonical 490-component catalog.
Each component is a pure macro with no lifecycle — the consumer
writes their own control markup, their own persistence, and their own
loading on top.

The helpers in this directory are higher-level: they own the
lifecycle, they own the dynamic loading or attribute application,
and they expose a smaller, more opinionated API split between the
macro (markup contract) and the client.js (runtime contract). Both
layers can coexist in one app; the helpers are not a replacement.

## Nunjucks idioms used throughout

The helpers commit to a small set of Nunjucks 3 conventions:

- A single `{% macro foo(opts) %}` … `{% endmacro %}` per file.
- camelCase macro names: `themeSelect`, `localeSelect`.
- kebab-case file paths and CSS class hooks.
- All defaults resolved with `{% set x = opts.x | default("…") %}`
  at the top of the macro body.
- Attribute spreading via
  `{% if opts.attributes %}{% for k, v in opts.attributes %} {{ k }}="{{ v }}"{% endfor %}{% endif %}`.
- No `{% extends %}` / `{% block %}` for the helpers themselves —
  custom rendering is achieved by passing markup via the
  `caller`-block pattern (see each helper's `docs/custom-rendering.md`).
- Filters used: `default`, `replace`, `capitalize`, `safe`.

Companion `*.client.js` modules use only standard DOM and ES2020
APIs — `document`, `localStorage`, `navigator`, `addEventListener`,
`querySelector`, `setAttribute`. No build step required.

## Sibling helper catalogs

The Nunjucks port is one of several framework ports of the same
contract. The canonical reference is the Svelte 5 implementation in
[`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/);
all other framework helpers (Vue, React, Angular, Blazor, Nunjucks)
mirror it clause-for-clause in `spec/index.md` §7.

- [`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/)
  — canonical reference.
- [`lily-design-system-vue-helpers`](../lily-design-system-vue-helpers/)
  — Vue 3 port (closest analog in API shape).
- [`lily-design-system-react-helpers`](../lily-design-system-react-helpers/)
  — React port.
- [`lily-design-system-nunjucks-helpers`](./) — this catalog.

When the Nunjucks port and the Svelte canonical disagree, the
Svelte side wins and the Nunjucks side is patched. The split (macro
vs client.js) is unique to Nunjucks; the contract on the wire (the
DOM the user sees) is identical across frameworks.

## Testing

Each helper ships a vitest suite that runs under jsdom. The macro
half of every test renders via `nunjucks.renderString`; the
client.js half mounts that HTML into the jsdom document and exercises
the runtime. The acceptance criteria are listed in each `spec/index.md` §7
and the test file matches one `test(...)` per numbered item.

```bash
cd lily-design-system-nunjucks-theme-select
pnpm test
```

The shared rules around test setup (jsdom, `nunjucks.configure`,
`document.body.innerHTML = …`, `document.head` reset between tests)
live in [`AGENTS/testing.md`](./AGENTS/testing.md).

## License

Each helper is dual-licensed under MIT or Apache-2.0 or GPL-2.0 or
GPL-3.0 or BSD-3-Clause. Contact joel@joelparkerhenderson.com for
other terms.

---

Lily™ and Lily Design System™ are trademarks.
