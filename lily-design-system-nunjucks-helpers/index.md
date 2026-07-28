# Lily Design System™ — Nunjucks Helpers

A catalog of opinionated, reusable Nunjucks 3 helper packages that
sit alongside the headless [`lily-design-system-nunjucks-headless`](../lily-design-system-nunjucks-headless/)
library. Where the headless library ships pure macro primitives,
these helpers wrap a complete lifecycle (selection + persistence +
DOM application) for one small, common job.

## Catalog

| Helper                                                                                            | Purpose                                                               |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`lily-design-system-nunjucks-theme-picker`](./lily-design-system-nunjucks-theme-picker/)         | Pick a visual theme; dynamic CSS load + `data-theme` swap.            |
| [`lily-design-system-nunjucks-locale-picker`](./lily-design-system-nunjucks-locale-picker/)       | Pick a BCP 47 locale; sets `lang` + `dir` on the document root.       |
| [`lily-design-system-nunjucks-text-size-picker`](./lily-design-system-nunjucks-text-size-picker/) | Pick a text size; sets `data-text-size` on the document root.         |
| [`lily-design-system-nunjucks-share-picker`](./lily-design-system-nunjucks-share-picker/)         | Share the page: native share sheet, or a list of destinations + copy. |
| [`lily-design-system-nunjucks-date-time-picker`](./lily-design-system-nunjucks-date-time-picker/) | Pick a date, a time, or both, via a text field + WAI-ARIA APG Date Picker Dialog. |

The first three helpers own a **user preference** — selection + DOM
application + optional persistence. `share-picker` owns an **action**:
it applies nothing to the document and persists nothing. `date-time-picker`
owns a **form value**: like `share-picker` it applies nothing to the
document and persists nothing, but unlike any of the other three it is
the fifth helper in the wider Lily™ catalog — currently Svelte-only
elsewhere — and the hardest of the six ports, because its macro cannot
render the calendar interior at all. See the dedicated section below.

## The split: macro + client.js

Nunjucks is, fundamentally, a server-side / build-time template
language. Most Lily™ helpers in sibling framework catalogs (Svelte,
React, Vue, Angular) live as a single component that owns both
markup and runtime. The Nunjucks port deliberately **splits** that
into two files:

| File                     | Runs where                | Owns                                                  |
| ------------------------ | ------------------------- | ----------------------------------------------------- |
| `{kebab-name}.njk`       | Nunjucks render time      | Markup, ARIA, class hooks, `data-lily-*` hooks.       |
| `{kebab-name}.client.js` | Browser (after page load) | Storage, attribute set, dynamic loading, interaction. |

The macro emits static markup carrying `data-lily-*` attributes that
describe the control's configuration; the companion ES module finds
those roots in the DOM at runtime and wires the apply lifecycle.
Consumers load the client.js once per page (typically via
`<script type="module">`) and call `autoInit()` to bind every control
present in the document.

This split exists because:

1. Nunjucks renders HTML. It cannot read `localStorage`, mutate
   `document.head`, or hook events; those live in the browser.
2. Build-time renderers (Eleventy, plain `nunjucks.render`) produce
   static HTML with no JS bundle required to _paint_ correctly.
3. The runtime is a tiny ES module with zero framework dependency
   that any consumer can drop into their template.

### How much survives without JavaScript

Little, and it differs between the preference helpers and
`share-picker`. Worth being blunt about both:

- **The three `*-select` helpers** — `theme-picker`, `locale-picker`,
  and `text-size-picker` — are icon buttons that open a custom listbox.
  **None of them is operable without JS**: the button has no handler
  and the listbox renders `hidden`. Each macro does emit a
  server-filled hidden `<input>`, so a form submit still carries a
  value, but the user cannot change it.
- The markup still _paints_ correctly server-side, and the chosen
  value is applied on the document root, so a value you resolve on the
  server survives with no JS. It is the _choosing_ that requires the
  client module.
- This is a deliberate tradeoff taken in the icon-button release: an
  icon-sized control and full styling control over the open list, paid
  for with a native `<select>` that worked everywhere. Each package's
  `docs/ssr.md` documents it and shows the no-JS alternative (the
  headless catalog's plain `<select>` containers).
- **`share-picker` degrades better**, and the difference is one of kind
  rather than degree. Its destination links are real `<a href>`
  elements with final URLs rendered server-side, so with no JS they
  still navigate, middle-click, open in a new tab, and expose "copy
  link address". What is lost is the _disclosure_ — the list cannot be
  opened, and copy is inert. The packaging, not the payload. That
  follows from what the helper does: the `*-select` helpers apply a
  preference to the document, which is inherently a runtime act, while
  this one's primary affordance is navigation, which HTML has always
  done unassisted. See
  [`share-picker/docs/ssr.md`](./lily-design-system-nunjucks-share-picker/docs/ssr.md),
  which also shows how to render a permanently-open list when full
  no-JS operation is a hard requirement.
- **`date-time-picker` degrades worst of the four**, and for a
  different reason again: it is not a matter of convention or effort,
  but of what a Nunjucks template can compute. The other three
  helpers' interiors are static option lists a macro *could* render
  (and choose not to, for consistency with the icon-button contract);
  `share-picker`'s destinations are consumer-supplied strings. This
  control's calendar grid, weekday headers, period heading, and
  hour/minute option lists are all a function of `Intl.DateTimeFormat`
  and the current date — computations Nunjucks genuinely cannot
  perform. So the macro renders only the fixed chrome (trigger, header
  nav buttons, footer, shortcut buttons) and
  `date-time-picker.client.js` builds the rest, every time the view
  changes. With no client script the trigger has no handler, the
  dialog never gets an interior, and only the hidden input's
  server-resolved value survives a form post. See
  [`date-time-picker/docs/accessibility.md`](./lily-design-system-nunjucks-date-time-picker/docs/accessibility.md).

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
- camelCase macro names: `themePicker`, `localePicker`.
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
cd lily-design-system-nunjucks-theme-picker
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
