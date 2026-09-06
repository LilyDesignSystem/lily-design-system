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

**This is a partial implementation, growing toward full parity: 261 of the
canonical 491 components as of 2026-09-06** (33 from the original P7-T6/P8-T7
slice, plus all 92 national personal identifier components, plus 136 more
across lists/forms/pickers/links/overlays/tables/media/data-viz/buttons,
all added in the completion push that started 2026-09-06). 35 components
are **permanently excluded** from this catalog by a real architectural
limitation (§2, §2.1); the other 195 not yet implemented are simply not
done yet, and are being added in ongoing batches. Every claim of
completeness below is scoped to what is actually implemented at the time
it's read — see §2 and §11 for the exact accounting.

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

- 261 native custom elements, one per canonical `components/{slug}/AGENTS.md`
  contract: the original 33 (8 buttons/links, 5 forms, 4 overlays, 6
  media/data, 7 content, and the 3-component breadcrumb navigation family —
  the P8-T7 pilot, see §2.1), all 92 national personal identifier
  components (46 identifier types x -input/-view), and 136 more across
  lists (32, including 13 more passive `*ListItem` families via "upgrade
  in place", §4.1), forms (50), pickers (14), links (14), and a mixed
  overlays/tables/media/data-viz/buttons batch (26) — all added in the
  2026-09-06 completion push toward the achievable 456 (§11.8).
- A vitest test file per component (1484 tests total across the 261
  `.test.ts` files, plus `index.test.ts` exercising the **built** `dist/`
  bundle end to end).
- A Storybook story per component (the 92 national-identifier stories
  grouped under "National identifiers"; the 2026-09-06 batches added
  "Lists", "Pickers", and "Links" categories, and grew "Overlays",
  "Tables", "Media and data", and "Buttons and links").
- The shared `lib/dom-utils.ts` helpers every component builds on.
- Required subproject files matching every other implementation directory:
  `index.md`, `README.md` (symlink), `AGENTS.md`, `CLAUDE.md`,
  `spec/index.md`, `.git-subtree-push`.

### Explicitly out of scope (permanent, architectural)

- **35 components are permanently excluded**, not merely not-yet-done: every
  table sub-element family (30: `*TableHead/-Body/-Foot/-Row/-TH/-TD` across
  `table`/`data-table`/`calendar-table`/`kanban-table`, and gantt's
  HTML-named equivalents) and the 5 `*ListItem` families whose canonical
  contract is interactive (`accordion-list-item`, `chat-list-item`,
  `check-list-item`, `document-list-item`, `tree-list-item`) — see §2.1 for
  why. Everything else not yet implemented (195 components as of
  2026-09-06) is open backlog, tracked in §11.8, not a permanent exclusion.
- CSS, stylesheets, a CSS framework dependency, inline styles beyond the
  one documented structural exception (§4).
- Shadow DOM (§3).
- A framework adapter layer (React wrapper, Vue wrapper, …) — a consumer in
  a framework should use that framework's own Lily catalog instead; this
  package targets no-framework and framework-agnostic contexts.

### 2.0 History: what "not implemented" used to mean here

Before 2026-09-06 this file described 458 components as out of scope by
deliberate initial-slice choice — "not an oversight to silently backfill;
it is the agreed scope of the initial subproject" (plan P7-T6: "scaffold +
representative subset"). That framing is retired: a completion push started
2026-09-06 to close as much of that gap as the architecture genuinely
allows (§11.8 tracks progress). What has not changed is the reasoning
behind the 35 components that stay out of scope regardless of how much of
the rest gets implemented: every table sub-element family, and every
interactive `*ListItem` family — `*TableHead/-Body/-Foot/-Row/-TH/-TD`
(table, data-table, calendar-table, kanban-table), gantt's HTML-named
equivalents, and `accordion-list-item`/`chat-list-item`/`check-list-item`/
`document-list-item`/`tree-list-item`. The underlying problem: a parent and
child with a required content-model relationship (`<ol>` + `<li>`,
`<table>` + `<thead>`) cannot have a wrapper element between them —
angular-headless hit and fixed exactly this defect class in its 0.3.0
wrapper-host-semantics migration (root spec §11.8) with a tag+attribute
selector (`li[lily-breadcrumb-list-item]`), a form only **customized
built-in elements** support, and those are permanently unsupported in
Safari/WebKit (§3). §2.1 records the pattern this catalog uses instead,
piloted on the breadcrumb family (P8-T7); it has a real cost that makes it
fit only passive items. The 13 non-interactive `*ListItem` families (plus
`description-list-item`, whose canonical tag is actually `<div>` and so
was never blocked at all) shipped 2026-09-06 via exactly this "upgrade in
place" pattern, extended and verified per component rather than assumed
safe by analogy — see §4.1. The 5 interactive `*ListItem` families and all
30 table sub-elements remain the permanent exclusion; nothing currently
known extends to them.

### 2.1 The "upgrade in place" pattern (P8-T7 pilot: breadcrumb family)

`BreadcrumbNav > BreadcrumbList > BreadcrumbListItem` ships as of
2026-09-03. The list item does what no other component here does: in
`connectedCallback` it builds the real `<li>`, moves the host's children
and attributes into it, and then `this.replaceWith(li)` — the custom
element **removes itself** from the tree. What remains is a pure
`<ol> > <li>` structure with no host node at all, so the content model is
satisfied without any selector trick. Verified by an axe-core run
restricted to the `list` / `listitem` rules — the exact rules that flagged
angular-headless's defect — over a rendered three-crumb trail: zero
violations (`breadcrumb-list-item.test.ts`).

The cost, stated plainly: after upgrade there is no custom-element
instance, so no `attributeChangedCallback` and no live reactivity. That is
acceptable for BreadcrumbListItem because its canonical contract is
passive (`Interactive: no`, no keyboard, a one-shot `current` flag read at
upgrade). It is **not** acceptable for an interactive list item, and the
pattern must not be copied to one without revisiting this. Table
sub-elements would additionally need the parent (`<table>`) to tolerate
the transient host during parsing — untested, still out of scope.

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
only real choice. The accepted cost: every one of the 30 wrap-pattern components
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

The counts above (26/30, 4/30) describe the original P7-T6/P8-T7 slice;
with 261 components shipped as of the 2026-09-06 completion push, pattern 1
covers the large majority and pattern 2 a modest handful (`Alert`,
`Banner`, `ContextualHelp`, `Coachmark`, plus every `*-group`/`*-banner`
component whose canonical root is a bare `<div>`) — see each file's own
header comment for its specific reasoning rather than a maintained running
count here.

### 4.1 "Upgrade in place" extended beyond breadcrumb (2026-09-06)

`theme-select-option` is the second real application of the §2.1 "upgrade
in place" pattern, for the same reason as `BreadcrumbListItem`: `<option>`
has the same hard content-model constraint as `<li>` — a `<select>`
recognises only `<option>`/`<optgroup>` children — so wrapping it in a
custom-element host would leave a non-`<option>` node inside `<select>`,
which browsers simply refuse to render as a selectable item. Same shape,
same trade-off (no live reactivity after upgrade), same precondition
(passive contract) as breadcrumb's pilot. The 13 additional passive
`*ListItem` families added the same day (§11.8) are further instances of
the identical `<li>`-in-`<ol>`/`<ul>` case breadcrumb already proved out.

### 4.2 Real constraint found: static HTML cannot author table content

Verified during the 2026-09-06 completion push (misc batch), independently
reproduced: per the HTML5 parsing spec, a start tag named
`thead`/`tbody`/`tfoot`/`tr`/`th`/`td`/`caption`/`col`/`colgroup` is
**ignored** (parse error, dropped) whenever the parser is not already
inside a real `<table>` element's own insertion mode — which is exactly
the situation while parsing a custom element's light-DOM children. Literal
source markup like `<lily-table><thead><tr><th>...</th></tr></thead>
</lily-table>` has its `<thead>`/`<tr>`/`<th>` tags silently discarded by
the browser's own parser before `connectedCallback` ever runs — verified
directly: the surviving content was bare concatenated text with every
structural element gone. `innerHTML` assignment goes through the same
parser and has the same problem. This affects all 5 table-root components
(`Table`, `CalendarTable`, `DataTable`, `GanttTable`, `KanbanTable`): the
only reliable way to populate their rows/cells is DOM construction
(`createElement`/`appendChild`), never a static or templated HTML string.
Documented in each component's own header comment. This is a real,
structural consequence of the table-sub-element exclusion (§2) — it is not
merely that this catalog doesn't *implement* `TableRow`/`TableTD` etc.,
it's that the platform itself won't let plain HTML express them inside any
non-`<table>`-context element, custom or otherwise.

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
  asserts all 33 tags self-register — the check that would have caught
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
  `components.tsv` — this package defines the 261 in §2.
- Version: 0.3.0 (2026-09-06: 125 → 261 components, non-breaking).

## 11. Acceptance criteria

- [x] 261 components implemented against their canonical
      `components/{slug}/AGENTS.md` contract (HTML tag, ARIA, keyboard,
      required/optional attributes): the original 33 spanning every major
      category (not clustered), including one complete
      `*Nav/*List/*ListItem` family (P8-T7); all 92 national personal
      identifier components; and 136 more across lists, forms, pickers,
      links, and a mixed overlays/tables/media/data-viz/buttons batch
      (all 2026-09-06).
- [x] Real, run-verified tests: 1484 tests across 261 `.test.ts` files, all
      green (`pnpm vitest run`), including a real defect the tests
      themselves caught and fixed during the 2026-09-06 push: 14 of 46
      national-identifier `-view` components were missing the `role="text"`
      their own canonical AGENTS.md calls for (announces the identifier as
      one unit rather than letting a screen reader fragment it) — added
      per-component, verified against each contract individually rather
      than applied blanket (32 of the 46 have it, 14 don't).
- [x] TypeScript compiles clean (`tsc --noEmit`).
- [x] `pnpm build` succeeds: generates `index.ts`, bundles a non-empty
      `dist/index.js` + `dist/index.d.ts` via tsup.
- [x] `index.test.ts` imports the **built** `dist/index.js` and confirms
      all 261 `lily-{slug}` tags self-register, plus one end-to-end render
      through the public entry point — 1484 tests total including this file.
- [x] `pnpm build-storybook` succeeds: all 261 stories compile and bundle
      (the 92 national-identifier stories grouped under "National
      identifiers"; the 2026-09-06 batches also added "Lists", "Pickers",
      and "Links" categories).
- [x] Required subproject files present (`index.md`, `README.md` symlink,
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`).
- [x] `bin/sync` run — root `AGENTS/*.md` present under this subproject's
      own `AGENTS/`.
- [x] `bin/test` run clean against this subproject (2026-09-06).
- [x] `bin/check-links` clean for this subproject's markdown (2026-09-06).
- [ ] Registered as a git subtree with its own standalone remote and
      pushed (pending first publish decision — not yet published to npm;
      the `.git-subtree-push` file is in place but no push has run yet).
- [ ] The remaining 195 achievable components (§11.8) — open backlog, being
      worked in batches.
- [ ] Angular-style `*ListItem`/table-sub-element wrapper-host-safe
      registration mechanism for autonomous custom elements — genuinely
      unsolved, tracked as future work, not a defect in what is shipped.
      The 5 interactive `*ListItem` families and 30 table sub-elements
      stay excluded regardless (§2); the 13 remaining passive
      `*ListItem` families plus `description-list-item` are open backlog
      where the P8-T7 "upgrade in place" pattern is the intended approach
      (§2.1), not yet applied.

### 11.8 Open backlog (2026-09-06)

- 195 of the 491 canonical components are not yet implemented, spanning
  the `content` (143) and `navigation` (52) categories. None of these 195
  are structurally blocked; they simply haven't been written yet,
  following the same two structural patterns (§4) as the 261 shipped so
  far. `lists`, `forms`, `pickers`, `links`, `overlays`, `tables` (root
  table-family elements, distinct from the excluded sub-elements),
  `media`, `data-viz`, and `buttons` were completed 2026-09-06. Being
  implemented in batches — see the root `CHANGELOG.md` for progress as
  batches land.

## 12. Related topics

- Root [spec/architecture/index.md](../../spec/architecture/index.md) — the
  monorepo layout this subproject joins as an 8th headless catalog.
- Root [spec/headless/index.md](../../spec/headless/index.md) — the
  cross-framework headless design rules this subproject follows.
- [AGENTS.md](../AGENTS.md) — this subproject's own machine-readable
  architecture reference.

---

Lily™ and Lily Design System™ are trademarks.
