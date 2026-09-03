# Lily Design System — Web Components Headless — Specification

Living specification for the native-custom-element implementation of the
Lily Design System. Single source of truth for spec-driven development of
this subproject. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first.

This subproject is an **8th headless catalog** alongside the seven listed in
the root spec (HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks) — the
root spec was amended 2026-09-03 (plan P8-T3) to frame the catalog as
7 full-catalog headless libraries plus this partial one; this file remains
the authoritative record of the addition.

**This is a deliberately partial implementation: 30 of the canonical 491
components, not full parity with the other seven catalogs.** Every claim of
completeness below is scoped to those 30. See §2 and §11 for exactly what is
and is not covered, and why.

---

## 1. Role in the ecosystem

This subproject ships native, framework-free implementations of a
representative slice of the Lily catalog as **autonomous custom elements**
(`customElements.define("lily-{slug}", class extends HTMLElement {...})`).
Every implemented component is headless: zero CSS, semantic HTML, ARIA,
focus and keyboard behaviour only — the same promise as the other seven
catalogs, delivered without a framework runtime.

The value this subproject proves: a consumer with no framework at all (or a
framework Lily doesn't otherwise cover — Solid, Qwik, Alpine, plain jQuery
pages, a CMS template) can still get a real Lily component, not a Lily-style
hand-rolled approximation.

## 2. Scope

### In scope

- 30 native custom elements, one per canonical `components/{slug}/AGENTS.md`
  contract, chosen to span every major category rather than cluster in one:
  8 buttons/links, 5 forms, 4 overlays, 6 media/data, 7 content.
- A vitest test file per component (163 tests total across the 30 `.test.ts`
  files, plus a 31st `index.test.ts` exercising the **built** `dist/`
  bundle end to end).
- A Storybook story per component.
- The shared `lib/dom-utils.ts` helpers every component builds on.
- Required subproject files matching every other implementation directory:
  `index.md`, `README.md` (symlink), `AGENTS.md`, `CLAUDE.md`,
  `spec/index.md`, `.git-subtree-push`.

### Explicitly out of scope (this slice)

- **461 of the 491 canonical components are not implemented here.** This is
  not an oversight to silently backfill; it is the agreed scope of the
  initial subproject (plan P7-T6: "scaffold + representative subset").
- **Every `*ListItem` and table sub-element family** — `*TableHead/-Body/
  -Foot/-Row/-TH/-TD` (table, data-table, calendar-table, kanban-table) and
  gantt's HTML-named equivalents. These need a native tag+attribute
  selector (e.g. a hypothetical `li[lily-breadcrumb-list-item]`) to avoid
  putting a wrapper element between a parent and child with a required
  content-model relationship (`<ol>` + `<li>`, `<table>` + `<thead>`) —
  angular-headless hit and fixed exactly this defect class in its 0.3.0
  wrapper-host-semantics migration (root spec §11.8). That selector form is
  only available to **customized built-in elements** (`<li is="...">`),
  and customized built-ins are permanently unsupported in Safari/WebKit
  (§3). Autonomous custom elements have no equivalent mechanism, so this
  whole family is a real, unsolved gap for this architecture — not
  something a bit more effort would have closed this session.
- **The 92 national personal identifier components.**
- CSS, stylesheets, a CSS framework dependency, inline styles beyond the
  one documented structural exception (§4).
- Shadow DOM (§3).
- A framework adapter layer (React wrapper, Vue wrapper, …) — a consumer in
  a framework should use that framework's own Lily catalog instead; this
  package targets no-framework and framework-agnostic contexts.

## 3. Architecture decision: autonomous custom elements, light DOM only

Two decisions were made explicitly, in this order, before any component was
written:

### 3.1 Autonomous custom elements over customized built-in elements

The Web Components spec defines two ways to register a custom element:

- **Autonomous** (`class X extends HTMLElement`, used with a hyphenated tag
  name like `<lily-button>`): works in every evergreen browser.
- **Customized built-in** (`class X extends HTMLButtonElement`, used as
  `<button is="lily-button">`): lets the custom element *be* the real native
  element with no extra host node — but WebKit has never implemented this
  half of the spec and has stated it will not
  ([WebKit bug 182671](https://bugs.webkit.org/show_bug.cgi?id=182671)),
  so `<button is="...">` silently fails to upgrade in Safari.

Lily targets every evergreen browser without a caveat, so autonomous is the
only real choice. The accepted cost: every one of the 30 components
introduces one extra DOM host node (`<lily-button>`) wrapping its real
semantic element (`<button>`), where a customized built-in would have had
none. This is a real, permanent structural difference from the other seven
catalogs' output, not a temporary implementation detail — see §11.5 for how
that host node is handled (data attributes, `aria-hidden` never applied to
it, etc.).

### 3.2 Light DOM only, no shadow root

A shadow root would isolate each component's internals from consumer CSS —
directly contradicting the headless contract every other catalog honours
("consumer CSS reaches every element via the kebab-case class hooks"). Light
DOM also keeps cross-component ARIA relationships (`aria-labelledby`,
`aria-describedby`, `aria-controls` reaching into another component)
working with plain `document.getElementById`, with no `part`/`::part()`
indirection. The cost: this package emulates a "named slot" (`FeaturePhoto`'s
`caption`/`credit`) via a `[slot="x"]` attribute convention distributed by
JS in `connectedCallback`, rather than a real `<slot>` element — the same
technique every other light-DOM-only Web Components library uses.

## 4. The two structural patterns

Every component follows one of two shapes, chosen per its canonical root
element (never chosen for convenience):

1. **Wrap a real native element** (26 of the 30) — `connectedCallback`
   creates the real semantic child, moves the host's original light-DOM
   children into it, sets attributes, and appends it. The custom-element
   host itself is inert scaffolding.
2. **Self-is-the-wrapper** (`Alert`, `Banner`, `ContextualHelp`, `Coachmark`
   — 4 of the 30) — used only where the canonical root is `<div>` with no
   native element behaviour worth deferring to. The host element itself
   carries the base class and ARIA state directly (`applySelfClassName` in
   `lib/dom-utils.ts`), avoiding a pointless `<div>` inside a `<div>`.

`FloatButton`'s inline `position: fixed` is the one documented structural
style exception, matching the precedent `ThemeProvider`'s `display:
contents` sets in the other catalogs (`AGENTS/headless.md`).

## 5. File layout

```
lily-design-system-web-components-headless/
├── components/
│   ├── {slug}.ts            ← implementation (class {PascalCase} extends HTMLElement)
│   ├── {slug}.test.ts       ← vitest spec
│   └── {slug}.stories.ts    ← Storybook story
├── lib/
│   └── dom-utils.ts         ← shared helpers (see §6)
├── stories/
│   └── render.ts            ← shared Storybook render helper (imperative DOM, no lit dependency)
├── build.mjs                ← generates index.ts, bundles dist/ via tsup
├── index.ts                 ← GENERATED barrel + registration (checked in, matching react-headless's precedent)
├── index.test.ts            ← dist/ end-to-end smoke test
├── .storybook/
├── package.json / tsconfig.json / vite.config.ts / vitest-setup.ts
└── (index.md / AGENTS.md / CLAUDE.md / spec/index.md / .git-subtree-push)
```

## 6. Shared helpers (`lib/dom-utils.ts`)

| Helper | Purpose |
| --- | --- |
| `moveChildrenInto(host, target)` | Move the host's original light-DOM children into a generated element. |
| `rootClassName(host, base)` | `"{base} {consumer's class attribute}"`, trimmed. |
| `applySelfClassName(host, base)` | Same, applied to the host itself (pattern 2 components). |
| `passThroughAttributes(host, target, handled)` | Copy every attribute the component doesn't itself interpret onto the generated element — the rest-props-spread equivalent. |
| `hasBooleanAttr(host, name)` | Presence-based boolean attribute read. |
| `nextId(prefix)` | Monotonic id generator for `aria-labelledby`/`aria-describedby` targets. |

## 7. Testing

- `vitest` + `jsdom`. Every `.test.ts` renders via
  `document.body.innerHTML = "<lily-x ...>...</lily-x>"` (parser-driven
  custom-element upgrade), matching how a real consumer's markup activates
  the element — not `document.createElement` + manual `connectedCallback()`
  calls, except in the specific cases where a synchronous thrown error
  needs to be asserted directly (jsdom reports, rather than propagates, an
  error thrown from inside the custom-element reaction queue — see the
  `icon-button.test.ts` / `float-button.test.ts` comments).
- `index.test.ts` imports the **built** `dist/index.js`, not source, and
  asserts all 30 tags self-register — the check that would have caught
  react-headless's historical "main pointed at a dist file that was never
  built" defect (root `CHANGELOG.md`) had it existed there.
- Run `pnpm build && pnpm test` for the full signal (source tests +
  dist-level smoke test); `pnpm test` alone skips the dist smoke test with
  a clear failure (missing `dist/index.js`) rather than a false pass.

### 7.1 Real defect found and fixed during this slice's own verification

`bar-chart.ts`'s first draft passed through unhandled attributes with
`for (const [key, value] of Array.from(this.attributes))` — `this.attributes`
is a `NamedNodeMap` of `Attr` nodes, not `[key, value]` pairs, so destructuring
each `Attr` as a 2-tuple threw `TypeError` on every render with at least one
attribute (i.e. every real usage, since `label` is required). Running the
component's own test suite caught this immediately (`renders a figure with
role=img` failed with "Cannot read properties of null"). Fixed by using the
same `passThroughAttributes` helper every sibling component already used —
the bug was writing a one-off replacement for existing shared code, not a
gap in the helper itself.

## 8. Build

`build.mjs`:

1. Scans `components/*.ts` (excluding `.test.ts` / `.stories.ts`), extracts
   each file's `export class {Name} extends HTMLElement` declaration via a
   regex (never derives the class name by string-casing the filename —
   a genuinely mismatched or missing export fails the build loudly instead
   of silently emitting a broken import), and generates `index.ts`: one
   `export { X } from "./components/{slug}.js"` plus a
   `customElements.define("lily-{slug}", X)` guarded by
   `!customElements.get(...)` (idempotent against double-registration,
   e.g. under HMR or a duplicate `<script>` include).
2. Removes any stale `dist/`, then bundles `index.ts` to ESM + `.d.ts` via
   `tsup`, and asserts the output is non-empty.

## 9. Storybook

`@storybook/web-components-vite`, no `lit` dependency: `stories/render.ts`'s
`h(tag, attrs, innerHTML)` builds the element imperatively
(`document.createElement` + `setAttribute` + `innerHTML`), since a plain
custom element needs no templating library. One story per component,
grouped under 5 categories (Buttons and links, Forms, Overlays, Media and
data, Content) matching this file's §2 breakdown.

## 10. Naming and publishing

- Package: `lily-design-system-web-components-headless`, npm, not yet
  published (see root `docs/releasing.md` for the publish gate).
- Custom element tags: `lily-{slug}`, one per canonical slug in
  `components.tsv` — this package defines only the 30 in §2.
- Version: 0.1.0.

## 11. Acceptance criteria

- [x] 30 components chosen spanning every major category (not clustered).
- [x] Each component matches its canonical `components/{slug}/AGENTS.md`
      contract (HTML tag, ARIA, keyboard, required/optional attributes).
- [x] Real, run-verified tests: 163 tests across 30 `.test.ts` files, all
      green (`pnpm vitest run`).
- [x] TypeScript compiles clean (`tsc --noEmit`).
- [x] `pnpm build` succeeds: generates `index.ts`, bundles a non-empty
      `dist/index.js` + `dist/index.d.ts` via tsup.
- [x] `index.test.ts` imports the **built** `dist/index.js` and confirms
      all 30 `lily-{slug}` tags self-register, plus one end-to-end render
      through the public entry point — 165 tests total including this file.
- [x] `pnpm build-storybook` succeeds: all 30 stories compile and bundle.
- [x] Required subproject files present (`index.md`, `README.md` symlink,
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`).
- [x] `bin/sync` run — root `AGENTS/*.md` present under this subproject's
      own `AGENTS/`.
- [ ] `bin/test` run clean against this subproject (pending — run after
      this file is committed).
- [ ] `bin/check-links` clean for this subproject's markdown.
- [ ] Registered as a git subtree with its own standalone remote and
      pushed (pending first publish decision — not yet published to npm;
      the `.git-subtree-push` file is in place but no push has run yet).
- [ ] Angular-style `*ListItem`/table-sub-element wrapper-host-safe
      registration mechanism for autonomous custom elements — genuinely
      unsolved, tracked as future work, not a defect in the 30 shipped.

## 12. Related topics

- Root [spec/architecture/index.md](../../spec/architecture/index.md) — the
  monorepo layout this subproject joins as an 8th headless catalog.
- Root [spec/headless/index.md](../../spec/headless/index.md) — the
  cross-framework headless design rules this subproject follows.
- [AGENTS.md](../AGENTS.md) — this subproject's own machine-readable
  architecture reference.

---

Lily™ and Lily Design System™ are trademarks.
