# Lessons from chanhdai.com and sv-chanhdai (planned work)

## Summary

Twelve improvements to Lily, plus open questions, proposed 2026-10-22 from a
review of two repositories (the first pass wrongly treated sv-chanhdai as
only effect components; items 8-12 come from two corrections: its `ui/` layer,
and eight `chan/` components that are real widgets): [chanhdai.com](https://github.com/ncdai/chanhdai.com)
(MIT, TypeScript, ~2.4k stars; a Next.js 16 portfolio that doubles as a
69-item shadcn registry of React components, hooks and blocks) and
[sv-chanhdai](https://github.com/SikandarJODD/sv-chanhdai) (MIT, 18 stars; a
community Svelte 5 port of that registry for the shadcn-svelte CLI, which also
ships a 47-component `ui/` layer on bits-ui, 27 ported `chan/` components, and
its own docs components). Neither is a headless, zero-CSS catalogue (both are
Tailwind-styled). chanhdai.com's registry and sv-chanhdai's `chan/` layer are
partly animated visual effects (`text-flip`, `shimmering-text`,
`glow-card-grid`) and partly real widgets (`wheel-picker`, `status-button`,
`apple-carousel`, `elastic-slider`, `middle-truncation`); sv-chanhdai's `ui/`
layer and docs components are not effects at all. Items 8-11 come from the
latter, item 12 from the widgets. The rest of what
transfers is the *packaging*: how one source tree yields a registry, docs,
raw-Markdown pages and `llms.txt`, and how a port stays in step with its
original. This topic complements [coss-ui-lessons](../coss-ui-lessons/index.md)
(recipes, manifests, Copy Markdown), which it deliberately does not repeat.
Nothing here is built yet: each item is an open acceptance criterion below.

## Scope

### In scope

The twelve items below, each with a deliverable, a source of truth and a
check, and the open questions that need a maintainer decision.

### Explicitly out of scope

- The pure visual-effect components (`text-flip`, `shimmering-text`,
  `glow-card-grid`, `dot-grid-spotlight`, `spinning-circular-text`, …). They
  are animation and styling, which the headless layer excludes. The widgets
  among the `chan/` components are assessed in item 12.
- The `ui/` layer's styling and its bits-ui / Tailwind dependencies; only its
  contracts are considered. Its overlap with
  [shardsui-lessons](../shardsui-lessons/index.md) and
  [coss-ui-lessons](../coss-ui-lessons/index.md) (menus, tooltips, dialogs,
  sheets) is not repeated.
- Tailwind, `motion`, `next-themes`, `c15t`: Lily takes no framework or
  animation dependency.
- Portfolio features (vCard, OG images, sponsors, bookmarks).

## What was reviewed

| Area | chanhdai.com | sv-chanhdai |
| ---- | ------------ | ----------- |
| Source layout | `src/registry/{components,hooks,lib,blocks,examples,styles}/`, each with a typed `_registry.ts` | `src/lib/components/{chan,ui,magic,apple-bento,docs}/`: 27 ported effects, 47 `ui/` primitives (Button, Dialog, Sheet, Sidebar, Item, Frame, Input group, Kbd, …), a `backlight` effect, a landing bento and the docs components; a hand-edited `registry.json` covers the ported ones |
| Registry output | `pnpm registry:build` generates `registry.json`, `registry-stats.json`, `__index__.tsx`, `public/r/*.json`; `AGENTS.md` says NEVER EDIT those | `pnpm build:blocks`; `registry.json` is edited by hand |
| Docs | One MDX per component, category derived from the folder, not frontmatter | Per-route `data.ts` (meta, SEO, props, install) and a generated `docs.md` |
| AI surface | `/llms.txt` plus a raw `.md` page for every doc, about, blog and component list; `.mcp.json` pointing at the shadcn MCP | `/llms.txt` and a `llms.txt/+server.ts` per component serving its `docs.md`; `AGENTS.md` that mandates the Svelte MCP |
| Tests | Vitest "characterization tests" that pin the registry transforms ("the expected values are whatever the current transforms produce") | None: no test files, no test script, no CI workflows |
| Scaffolding | Five-step "Adding a new component" in `AGENTS.md` | `create:route <slug> --dry-run`, `create:route --source`, `generate:docs`, plus `create_component.md` and `command.md` checklists |

sv-chanhdai's `ui/` layer tags every part `data-slot="…"` (for example
`item-footer`), the same job as Lily's stable kebab-case sub-classes; Lily's
classes already meet the need, so no change is proposed.

Not reviewed in depth: most of the `ui/` primitives (read: `copy-markdown`,
`open-in-chat`, `pm-command`, `light-switch`, `masonry-grid`, `annotation`,
`highlight`, `extra/button`, the `api-table` doc component; and, in `chan/`,
the eight of item 12), the rest of the `chan/` components, the sponsor/analytics wiring,
and the shadcn registry schema beyond what the two repos use.

## The items

### 1. A "never edit" list for generated files in `AGENTS.md`

chanhdai.com's `AGENTS.md` names every generated output and forbids editing
it (`registry.json`, `registry-stats.json`, `__index__.tsx`, `public/r/*.json`).
Lily has many generated files (the example-app registries, `component-examples`
data, `/r/{slug}.json` manifests, `components-categories.tsv`, the sitemap,
mirrored example components, `shared/` copies) and the rule lives only in
scattered per-tool notes.

- **Deliverable:** one table in `AGENTS/lily.md`: generated file or glob →
  generator → check command, with the sentence "edit the source, never the
  output".
- **Check:** `bin/test` already runs most `--check` modes; add a script that
  fails when a generator named in the table has no `--check`.

### 2. Serve a raw `.md` of every page

chanhdai.com serves `/components/{slug}.md` next to each HTML page and lists
them in `llms.txt`, so an agent fetches Markdown, not HTML. Lily's docs site
already has `/components/{slug}.md` copies from `bin/generate-api-docs`.
The gap is the *other* pages: the eight main pages, the translated pages, the
topic specs.

- **Deliverable:** `.md` twins for the site's main pages and the topic index
  pages, each linked from `llms.txt` / `llms.json`.
- **Related:** coss's Copy Markdown button in
  [coss-ui-lessons](../coss-ui-lessons/index.md); the twin is its target.
- **Check:** `bin/generate-sitemap --check`-style drift check: every route
  with an HTML page has a `.md` twin or an allow-listed reason.

### 3. A per-component `llms.txt`

sv-chanhdai serves one `llms.txt` per component from its `docs.md`, so an
agent reads one component's contract without the whole catalogue. Lily's
single `llms.txt` links 571 components; its per-component `.md` copies exist
but are not announced in a per-component convention.

- **Deliverable:** decide between `/components/{slug}.md` (today) and
  `/components/{slug}/llms.txt`, document the choice in
  [llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md), and make the
  `llms.json` entries point at the chosen form.
- **Why:** one predictable URL per component is what lets a skill fetch only
  what it needs.
- **Check:** `bin/generate-api-docs` drift check covers the URL.

### 4. A generator-driven scaffold with `--dry-run`

sv-chanhdai's `create:route <slug> --dry-run` prints the files it would write
before writing any. Lily's `bin/new-component` and
`bin/create-component-directory` write at once, across every layer.

- **Deliverable:** `--dry-run` on `bin/new-component`,
  `bin/create-component-directory` and `bin/create-implementation-directory`,
  listing each path and whether it would be created or overwritten.
- **Why:** `bin/new-component` touches eight libraries, eight example apps
  and the docs; a preview is cheap insurance.
- **Check:** a test that a dry run leaves `git status` clean.

### 5. Characterization tests for the generators

chanhdai.com pins the registry transforms with tests that say what they are:
the expected value is whatever the current transform produces, so a refactor
that changes the published output fails. Lily's generators
(`bin/generate-registries`, `generate-examples`, `generate-site-pages`,
`generate-api-docs`) are checked for drift against the repository, but a
change to a generator that changes every output at once drifts and is simply
regenerated.

- **Deliverable:** a small fixture catalogue (three components) with golden
  outputs per generator, run by `bin/test`.
- **Rule:** a golden file is regenerated only deliberately, by a flag, and the
  diff is reviewed.
- **Check:** the golden tests run in CI.

### 6. Per-component "Reduced motion" sections, and a test

chanhdai.com's docs give animated components a "Reduced motion" section that
states exactly what is skipped and what is kept (the carousel still cycles,
cross-fading instead of sliding, so no logo is dropped). Lily's headless
layer never animates, but its examples, themes and the `motion-picker`
`data-motion` hook do, and no component page says what a consumer must keep
when motion is off.

- **Deliverable:** for components with an obvious motion treatment
  (`carousel`, `slider`, `skeleton`, `slide-out-drawer`, `loading`,
  `scroller*`), a **Reduced motion** subsection in `index.md` stating what to
  suppress and what must survive (content, focus, order).
- **Rule:** reduced motion changes *how* content appears, never *whether* it
  does.
- **Check:** the example apps' Playwright suites run the three affected demos
  with `reducedMotion: "reduce"` and assert the content is still present.

### 7. A "port in step" contract for Web Components and Alpine

sv-chanhdai credits the original, links both sponsor pages and mirrors the
original's item names one for one, which is why it can stay current. Lily
has the same shape internally: the Web Components helpers are an
"independent copy" of the HTML helpers that "must be kept in step
deliberately, since nothing ports between them automatically", and the Alpine
helpers are "a subset of the Svelte reference".

- **Deliverable:** a drift report, `bin/check-port-parity`, that lists for
  each port the public names (props, events, class hooks) present in its
  reference and missing from it, with an allow-list of deliberate
  differences and a reason for each.
- **Check:** runs in `bin/test`; an unlisted difference fails.

### 8. Open-in-assistant links, with no bundled providers

sv-chanhdai's `open-in-chat` is a dropdown whose items open the current page,
as a prompt or URL, in Claude, ChatGPT, v0, T3 or Scira: a context holds the
query and each provider is `{ title, createUrl(query), icon }`. It builds on
`dropdown-menu`, its items are real `<a target="_blank" rel="noopener">`, and
the providers are hard-coded.

- **Deliverable:** a documented recipe (in the recipes layer proposed by
  [coss-ui-lessons](../coss-ui-lessons/index.md)) built on `menu-picker` or
  `share-picker`: the consumer passes `targets`, each with `href(query)`.
- **Rule:** Lily ships no provider endpoints, exactly as `share-picker` ships
  no social-network URLs; which assistants belong in a product is an editorial
  and privacy decision, and the URLs change.
- **Related:** the AI page links in
  [daisyui-lessons](../daisyui-lessons/index.md) and Copy Markdown in
  coss-ui-lessons are the same feature; one recipe should serve all three.
- **Check:** the recipe's test asserts real links with `rel="noopener"` and
  a URL-encoded query.

### 9. Pending-state contract for async buttons

sv-chanhdai's `extra/button` adds `loading` and `onClickPromise`: the button
disables itself, shows a spinner while the promise runs, and re-enables in a
`finally`. The pattern is common, and the defect is nearly as common: a
`disabled` button leaves the tab order, so keyboard focus is lost mid-action
and a screen reader announces nothing.

- **Deliverable:** document in `button` and `loading-button`-style usage
  (`button`, `loading`) the pending contract: keep the button focusable, set
  `aria-busy="true"` and `aria-disabled="true"`, ignore repeat activation,
  and announce completion through a deliberate live region. `disabled` is not
  used for pending.
- **Scope:** an optional `pending` prop is added only if a consumer needs it;
  the promise handling stays the consumer's (no data fetching or network
  state in the headless layer).
- **Check:** a test per library that pending keeps focus and a second click
  does nothing.

### 10. Package-manager command tabs

sv-chanhdai's `pm-command` renders one command as pnpm / npm / yarn / bun
tabs with a copy button, resolving the text with `package-manager-detector`.
Lily's own docs show only npm / NuGet install lines.

- **Deliverable:** a docs-site and example-app recipe, not a catalog
  component: `tabs` plus `clipboard-copy-button` plus `code`, with the
  per-manager command strings supplied by the page. No new dependency.
- **Why a recipe:** the variation (which managers, which commands) is content,
  which the headless layer leaves to the consumer.
- **Check:** the site's install blocks use it and pass the existing axe sweep.

### 11. Catalog gaps seen in the `ui/` layer

A slug search of `components.tsv` found no match for these `ui/` components.
Each is a candidate catalog entry only if it is more than a styled `<div>`:

| `ui/` component | Lily today | Verdict to decide |
| --------------- | ---------- | ----------------- |
| `item` (media, content, title, description, actions, footer, group, separator) | no generic row; many `*-list-item` families | decide: a generic `item` family, or document composing `description-list` / `summary-list` |
| `frame` (header, panel, title, description, footer) | none | likely a recipe on `figure` / `fieldset` / `article`, not a component |
| `highlight` (a `<mark>` with a marker-gradient look) | `mark` exists | document the look as a theme recipe on `mark` (`--marker-color`); no component |
| `annotation` (note text, eight arrow directions, custom properties for gaps) | none | decorative; the note must stay real text tied to its target. Open question below |
| `light-switch` (a sun / moon toggle with a `D` hotkey and a `kbd` tooltip) | `theme-picker`, `kbd-shortcut` | no; a toggle is a lesser `theme-picker`. Document the hotkey as an app concern |

Already present in Lily: `input-group`, `button-group`, `hover-card`,
`command`, `collapsible`, `resizable`, `scroll-area`, `sidebar`, `masonry`,
`kbd-shortcut`, `toast`, `separator`. Confirmed for the other `ui/`
primitives only by name, not by contract.

- **Deliverable:** a decision recorded per row (add, recipe, decline) in this
  topic, and `bin/new-component` run for each "add".

### 12. Eight `chan/` components, assessed

Read for their roles, keys and ARIA (sv-chanhdai source, with chanhdai.com's
docs for the original):

| Component | What it really is | Lily today | Verdict |
| --------- | ----------------- | ---------- | ------- |
| `wheel-picker` | `role="listbox"`, `aria-orientation="vertical"`, `role="option"` with `aria-selected` / `aria-disabled`, a roving `tabindex`, keyboard navigation, type-ahead over labels, infinite loop, touch inertia | `listbox` (catalog, with an `active-descendant` mode); no wheel | **Added 2026-10-23 in all nine catalogs** as `wheel-picker`: a single-select listbox whose roles, keys and type-ahead are headless; inertia and snapping stay CSS (`scroll-snap`). Also the natural control for the time part of `date-time-picker` (not yet wired in) |
| `status-button` | idle / loading / success / error states; `aria-busy`, `aria-disabled` (not `disabled`), focus kept while busy; `role="status"` and `role="alert"` live regions; invisible copies of each label reserve the width so the button never resizes | `button`, `loading`, `status-light` | **Fold into item 9**: this is the evidence for it. Add as `status-button` only if the per-state live-region wiring is worth owning |
| `apple-carousel` | APG tabbed carousel: `role="tablist"` / `tab` / `tabpanel`, roving `tabindex`, ArrowLeft / ArrowRight / Home / End, a Play / Pause button whose label changes, no autoplay until Play is pressed, cloned items for the loop | `carousel` (region + `aria-roledescription` only; navigation, autoplay and pause are left to the consumer) | **Document** the APG pattern in `carousel`: tab controls, the rotation-control rule (WCAG 2.2.2), and that cloned slides must be `aria-hidden` and non-focusable. The clones here carry no role but are not marked hidden, so a screen reader may read them twice: do not copy that |
| `elastic-slider` | `role="slider"` with `aria-valuemin` / `valuemax` / `valuenow` / `valuetext`, Arrow / Home / End; the rubber-band stretch is skipped under reduced motion | `slider` (Home documented; no `aria-valuetext` or PageUp / PageDown in its docs) | **Tighten** `slider`'s contract: `aria-valuetext` (a formatted string supplied by the consumer), PageUp / PageDown steps, and a Reduced motion note (item 6). The elastic effect itself is not Lily's |
| `middle-truncation` | measures the rendered text with a canvas `measureText`, re-runs on resize with a `ResizeObserver`, then renders the shortened string; `title` holds the full text | none | **Added 2026-10-23 in the Svelte canonical** (not as built: see the rule below) |
| `github-contributions` | a year-of-days SVG graph, a `<title>` on each cell, a legend and total; fetches, caches for a day and streams behind Suspense | `heatmap-chart`, `calendar-year-table` | **Done 2026-10-22: `heatmap-chart-with-year-of-days`** (a `HeatmapChart` specialisation with required `year` and `weekStart`, the week-column/weekday-row layout contract and a data-table sibling). Originally "recipe only": a `heatmap-chart` fed by consumer data. Fetching and caching are out of scope (no data fetching). The chart pattern's sibling data table, not per-cell `<title>`, is how Lily exposes the values |
| `slide-to-unlock` | a draggable handle (drag only); no role, no keyboard handler and no alternative to dragging was found in the source | none | **Decline as built.** A drag-only control fails keyboard operation (2.1.1) and dragging alternatives (2.5.7). If wanted, it is a `<button>` (confirm) with the drag as an optional enhancement, which is a recipe on `button`, not a component |
| `apple-hello-effect` | an SVG handwriting animation of "hello" in four languages, one file per language, with a `<title>` | none | **Decline.** Decoration, and shipping greetings in four languages breaks the no-hardcoded-strings rule |

**The `middle-truncation` rule.** The source renders only the shortened
string, so a screen reader, find-in-page and copy all get `report-fi…q3.pdf`;
`title` helps a hovering pointer only. Lily's version keeps the full text in
the DOM and exposes it: the visual, shortened string is `aria-hidden` and the
full text sits in a visually hidden sibling (or the shortened part is a CSS
`text-overflow` over the full text, where the strategy allows). The ellipsis is
a prop with no default, per the i18n rule, and the fixed-end / minimum-end /
even-split strategies are an enum.

- **Deliverable:** catalog entries `wheel-picker` and `middle-truncation` via
  `bin/new-component`; the `carousel` and `slider` contract changes above;
  the recipes and declines recorded here.
- **Check:** for `middle-truncation`, a test that the full text is in the
  accessibility tree and that a resize changes only the visual string.

## Open questions (not yet items)

- **A shadcn-style `registry.json` output.** chanhdai.com publishes
  `public/r/{name}.json` in the shadcn schema so `npx shadcn add` installs a
  component. Lily already has `/r/{slug}.json` manifests; whether to make them
  schema-compatible with shadcn / shadcn-svelte (copy-in distribution
  alongside the npm packages) is a distribution decision for the maintainer,
  and overlaps the manifests item in
  [coss-ui-lessons](../coss-ui-lessons/index.md).
- **MCP config in the repo.** Both repos commit an `.mcp.json` / `.cursor/mcp.json`.
  Lily's [daisyui-lessons](../daisyui-lessons/index.md) already proposes a
  read-only MCP server; committing a project config that points at it is the
  small follow-up, once the server exists.
- **A "registry stats" file.** chanhdai.com emits `registry-stats.json`
  (total and count by type). Lily's counts (571, 536, 133 packages…) are
  hand-written across `AGENTS/`, the spec and the site; a generated
  `stats.json` consumed by those pages would end the count drift, but it is a
  larger change than one item.
- **`annotation`.** Eight arrow directions and gap custom properties make it
  a pure presentation component with a text note. If added, the note is a
  real visible text node (not a CSS `content:` string, which assistive
  technology may skip), and the arrow is decorative. Needs a maintainer call.
- **`masonry-grid` retry.** Each masonry card has a retry button that
  re-keys its content so a demo can replay; Lily's example apps could offer
  the same on animated demos. Not an item: it is demo chrome.
- **Not copied:** the animated-effect catalogue; shipping
  a `Tailwind`-class component source; the sponsor-logo block in the README
  (Lily's [free-open-source-funding](../free-open-source-funding/index.md)
  topic already governs this).

## Acceptance criteria

- [ ] 1. `AGENTS/lily.md` lists every generated file with its generator and check.
- [ ] 2. Every site page has a `.md` twin or an allow-listed reason.
- [ ] 3. One per-component Markdown URL convention is decided and documented.
- [ ] 4. The three scaffolders accept `--dry-run` and write nothing under it.
- [ ] 5. Each generator has golden-output tests in `bin/test`.
- [ ] 6. Motion-bearing components document "Reduced motion", and the Playwright check passes.
- [ ] 7. `bin/check-port-parity` reports Web Components and Alpine drift against their references.
- [ ] 8. One open-in-assistant recipe exists with consumer-supplied `href(query)` targets and no bundled endpoints.
- [ ] 9. The async-button pending contract is documented and tested in each library.
- [ ] 10. The docs site's install blocks use a package-manager tabs recipe.
- [ ] 11. A decision (add, recipe, decline) is recorded for each row of the gap table.
- [ ] 12. `wheel-picker` and `middle-truncation` exist in the catalog; `carousel` and `slider` carry the tightened contracts.
- [ ] The open questions above are decided, or recorded as declined.

## Related topics

[coss-ui-lessons](../coss-ui-lessons/index.md),
[daisyui-lessons](../daisyui-lessons/index.md),
[llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md),
[tooling](../tooling/index.md),
[testing](../testing/index.md),
[accessibility](../accessibility/index.md),
[frameworks](../frameworks/index.md).

## Sources

- [chanhdai.com](https://github.com/ncdai/chanhdai.com): `AGENTS.md`, `README.md`, `registry.json`, `registry-stats.json`, `src/lib/registry.test.ts`, `src/app/(llms)/llms.txt/route.ts`, `src/features/doc/content/components/*.mdx` (read 2026-10-22).
- [sv-chanhdai](https://github.com/SikandarJODD/sv-chanhdai): `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `create_component.md`, `command.md`, `registry.json`, and `src/lib/components/ui/` (`copy-markdown`, `open-in-chat`, `pm-command`, `light-switch`, `masonry-grid`, `annotation`, `highlight`, `extra/button`) and `src/lib/components/chan/` (`svelte-wheel-picker`, `slide-to-unlock`, `status-button`, `apple-carousel`, `github-contributions`, `elastic-slider`, `middle-truncation`, `apple-hello-effect`) (read 2026-10-22).
- [llms.txt convention](https://llmstxt.org).
