# Lily Design System — HTML Helpers

A catalog of opinionated, reusable vanilla HTML + JavaScript helper
**web components (custom elements)** that sit alongside the headless
[`lily-design-system-html-headless`](../lily-design-system-html-headless/)
library. Where the headless library ships pure HTML snippets,
these helpers wrap a complete lifecycle (selection + persistence +
DOM application) for one small, common job — and ship that lifecycle
as a registered custom element you drop into any page.

## Catalog

| Helper                                                                              | Custom element     | Purpose                                                        |
| ----------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------- |
| [`lily-design-system-html-theme-select`](./lily-design-system-html-theme-select/)   | `<theme-select>`   | Pick a visual theme; dynamic CSS load + `data-theme` swap.     |
| [`lily-design-system-html-locale-select`](./lily-design-system-html-locale-select/) | `<locale-select>`  | Pick a BCP 47 locale; sets `lang` + `dir` on the document root. |
| [`lily-design-system-html-text-size-select`](./lily-design-system-html-text-size-select/) | `<text-size-select>` | Pick a text size; sets `data-text-size` on the document root. |

## Conventions

Every helper subproject follows the same shape:

```
lily-design-system-html-<name>/
├── spec.md                  ← single source of truth (SDD)
├── AGENTS.md                ← AI-agent metadata pointer
├── CLAUDE.md                ← loads AGENTS.md
├── AGENTS/                  ← topic-by-topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── index.md                 ← comprehensive user guide
├── index.ts                 ← barrel re-export + side-effectful define
├── <kebab>.ts               ← the custom element class
├── <kebab>.test.ts          ← vitest + jsdom spec (one test per §7 acceptance)
├── docs/                    ← human-readable topic guides
├── examples/                ← runnable .html files (each is self-contained)
└── CHANGELOG.md
```

The catalog parent shares its own `AGENTS/` and `AGENTS/shared/`
directories with conventions, testing, accessibility, and SSR rules,
plus the Lily-wide headless / i18n / theme principles ported from
the root canonical AGENTS files.

Shared design decisions across the catalog:

- **Web components**: each helper is a custom element extending
  `HTMLElement`, registered via `customElements.define(...)` on
  module import. Consumers can simply `import` the module; no
  explicit register call is needed (importing the class without the
  side-effect from `<kebab>.ts` is also supported).
- **Light DOM**: the custom element itself uses light DOM (not
  Shadow DOM), so the consumer's CSS reaches the rendered markup
  via stable kebab-case class hooks.
- **Attribute-driven config**: attributes are kebab-case strings
  (`themes-url`, `storage-key`, `default-value`, `apply-dir`).
  Array-valued options (`themes`, `locales`) accept either a
  comma-separated attribute (`themes="light,dark,abyss"`) or a JS
  property assignment (`el.themes = ["light", "dark", "abyss"]`) for
  consumers who need ergonomic native arrays.
- **CustomEvent for change notifications**: every helper dispatches
  a single bubbling, composed `CustomEvent` (`themechange`,
  `localechange`) carrying a strongly-typed `detail` object. No
  `update:value` pattern — the element's attribute / property is
  the source of truth.
- **TypeScript** on the public surface; types exported from
  `index.ts`.
- **Headless**: no bundled CSS, fonts, icons, or images. Consumer
  styles every visual aspect.
- **i18n-clean**: every user-facing string comes from an attribute
  or property.
- **One job per helper**: each helper owns the entire lifecycle of
  one user-preference dimension (theme, language, etc.) and composes
  cleanly with the others.
- **Spec-driven**: every helper has a `spec.md` numbered with §
  references; tests assert against those numbers; docs link back.

## Vanilla web-component idioms used throughout

The helpers commit to a small set of platform features:

- `class extends HTMLElement` for every helper. No
  `customElements.define("ce", X, { extends: "div" })` "customised
  built-in" path — that path is Safari-hostile.
- `static get observedAttributes()` enumerates the watched kebab-case
  attributes. `attributeChangedCallback(name, old, value)` reacts to
  every change.
- `connectedCallback()` resolves the initial value (per spec §5) and
  renders.
- `disconnectedCallback()` runs deliberate cleanup (e.g.
  garbage-collecting the managed `<link>` only when no other select
  with the same `name` remains in the document).
- JS-property setters: kebab-case attributes are mirrored by
  camelCase JS properties (`label`, `themesUrl`, `defaultValue`,
  `storageKey`). Array / object properties (`themes`,
  `themeLabels`, `locales`, `localeLabels`) accept native
  `Array<string>` / `Record<string, string>` and round-trip through
  the matching string-encoded attribute (CSV for arrays, JSON for
  objects).
- `CustomEvent` for change notifications: `bubbles: true`,
  `composed: true`, `detail` typed via an exported helper type
  (`ThemeSelectChangeDetail`, `LocaleSelectChangeDetail`).
- Imperative DOM mutation in the element body — no template
  libraries, no Shadow DOM, no string templating helpers.

These choices map 1:1 to the Svelte canonical helpers so behaviour
and tests stay in lock-step across frameworks.

## Differences from the headless library

The HTML headless library mirrors the canonical 492-component
catalog. Each entry is a static HTML snippet plus a minimal
initialisation hook. A consumer typing on top of `theme-select.html`
from `lily-design-system-html-headless` writes their own radio
markup, their own persistence, and their own dynamic loading.

The helpers in this directory are higher-level: they own the
lifecycle, they own the dynamic loading or attribute application,
and they expose a smaller, more opinionated API surface — one
custom-element tag per helper. Both layers can coexist in one page;
the helpers are not a replacement.

## Differences from the Svelte / Vue helpers

The Svelte helpers in
[`../lily-design-system-svelte-helpers/`](../lily-design-system-svelte-helpers/)
share the same specification numbering and the same default
behaviour. The Vue helpers in
[`../lily-design-system-vue-helpers/`](../lily-design-system-vue-helpers/)
are a direct port of the Svelte canonical for Vue 3.

The HTML helpers are the framework-free counterpart: a single import
registers the custom element, after which the element behaves
identically — no `bind:value` (Svelte) and no `v-model:value`
(Vue), just an attribute that mirrors a JS property and a
`CustomEvent` for change notifications.

Differences between this catalog and the Svelte canonical:

| Concept              | Svelte canonical                       | HTML port (custom element)                                  |
| -------------------- | -------------------------------------- | ----------------------------------------------------------- |
| Two-way binding      | `bind:value`                           | Read/write `el.value` / `el.setAttribute("value", …)`       |
| Reactive state       | `$state`, `$bindable`                  | Internal `#private` fields + `attributeChangedCallback`     |
| Reactive side-effects | `$effect`                              | `connectedCallback` + `attributeChangedCallback`            |
| Render props / slots | Snippet (`{#snippet children(...)}`)   | Subclass the element class, override `#render()`            |
| Stylesheet head      | `<svelte:head>`                        | Imperative `document.head.appendChild(...)`                 |
| Change notification  | `onchange` prop callback               | `CustomEvent("themechange" / "localechange")`               |
| SSR                  | `hooks.server.ts` + `transformPageChunk` | Static-site generator (Eleventy / Astro / Hugo) renders attributes, client upgrades |
| Storybook            | `*.stories.svelte`                     | Static `.html` files in `examples/`                         |
| File ext             | `.svelte`                              | `.ts` (class) + `.html` (examples)                          |

The DOM contract and behaviour are otherwise identical; the tests
match clause-for-clause.

## Testing

Each helper ships a vitest suite that runs under jsdom. The
acceptance criteria are listed in each `spec.md` §7 and the test
file matches one `it(...)` per numbered item, named with the section
number for fast cross-referencing.

```bash
cd lily-design-system-html-theme-select
pnpm test
```

The shared rules around test setup (jsdom, mounting custom elements,
`attributeChangedCallback` timing, `CustomEvent` capture) live in
[`AGENTS/testing.md`](./AGENTS/testing.md).

## License

Each helper is dual-licensed under MIT or Apache-2.0 or GPL-2.0 or
GPL-3.0 or BSD-3-Clause. Contact joel@joelparkerhenderson.com for
other terms.
