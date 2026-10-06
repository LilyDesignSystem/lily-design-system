# Changelog — @lilydesignsystem/angular-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).
The canonical monorepo history is in the root
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).

## 0.5.0 — 2026-10-06

**Breaking.** `DateRange` is now a `<fieldset class="date-range" aria-label>` holding two
`<input class="date-input" type="date" aria-label>` (it was a bare `<div>`); new inputs `startLabel` and `endLabel`
and two-way `start` / `end` models. `ReviewDate` renders a `<time class="review-date" datetime>` (was a `<div>`);
new `datetime` input. See the monorepo CHANGELOG, "`DateRange` is a fieldset everywhere".

## 0.4.0 — 2026-10-06

**16 new components (catalog 555 → 571); no breaking changes.**
Seven charts built with the graphic + optional data-table structure
introduced in the previous release: `pie-chart`, `ring-chart`,
`funnel-chart`, `candlestick-chart`, `composed-chart`, `choropleth-chart`,
`sunburst-chart`. `streaming-text` (a polite, atomic status region that goes
busy while text arrives, then announces the finished text once). `tool-call`
(a native `<details>` with `status`) and its inner parts `tool-call-name`,
`tool-call-status`, `tool-call-input`, `tool-call-output`, `tool-call-error`.
`mark` (the native `<mark>` highlight). `chat-composer` (a chat input form:
growing textarea, Enter sends, Shift+Enter inserts a line break, IME-safe, one
button that is send or stop). See the monorepo CHANGELOG for the full record
and the per-library deviations (Blazor: no plain-Enter send; Nunjucks and
HTML: markup-only `chat-composer`).

## 0.3.0 — 2026-10-05

**16 new components (catalog 539 → 555) and a breaking chart change.**
New: `one-time-password-input`, `multi-select`, `multi-select-with-extras`,
`empty-state`, `show-more`, `kbd-shortcut`, `calendar-year-table`,
`calendar-month-table`, `calendar-week-table`, `calendar-day-table`,
`thinking`, `gauge-chart`, `heatmap-chart`, `radar-chart`, `sankey-chart`,
`file-tree`.

**Breaking:** `area-chart`, `bar-chart`, `column-chart`, `line-chart` and
`scatter-chart` (and the four new charts) now render `<figure
class="{chart}">` holding a `<div class="{chart}-graphic" role="img"
aria-label>` plus an optional sibling `<div class="{chart}-data-table">`.
`role="img"` is no longer on the `<figure>`: a table inside a `role="img"`
element is presentational and was unreachable to assistive technology.
Consumer CSS or tests that targeted `figure[role=img]` must target
`.{chart}-graphic`. `aria-describedby` passed as a rest prop still lands on
the `<figure>`. See the monorepo CHANGELOG for the full record.

## 0.2.0 — 2026-09-21

**`Listbox` and `IconButton` extended, additively, so the `*-helpers`
catalog's picker components can compose them instead of hand-rolling
equivalent markup/keyboard logic — porting the same refactor already
done for the Svelte catalog.** Both components had zero real consumers
elsewhere in this catalog before the change (confirmed by search) —
full suite (1027 tests) stays green.

- `IconButton` and `Listbox` gain `baseClass` (defaults `"icon-button"`
  / `"listbox"`, unchanged) replacing the hardcoded prefix outright
  instead of appending to it, plus a public `focus(options?)` method
  (Angular CDK's `FocusableOption` idiom) so a composing consumer can
  focus the real rendered element — neither component previously
  exposed any way to do that. `IconButton` also gains a public `element`
  getter (the real `<button>` itself) for a consumer that needs the raw
  node rather than just a focus action — e.g. `date-time-picker`
  remembering it as a focus-restoration target and doing an
  `instanceof HTMLElement` check against it. Both components' selector host tag
  (`<lily-icon-button>` / `<lily-listbox>`) is now unconditionally
  `display: contents` (via `host: { style: ... }`): Angular's component
  model always emits a real host element for its own selector, unlike
  Svelte's no-wrapper-root option, so composing either inside another
  component's template would otherwise insert a visible extra box
  between that component's root and the real `<button>`/`<div>` —
  the same "structurally required inline style" exception already
  documented for `ThemeProvider` in spec/headless/index.md.
- `Listbox` gains an opt-in `navigation="active-descendant"` input
  (default remains `"roving-focus"`, which was — and remains —
  entirely inert: this component shipped with no keyboard handling of
  any kind, so there was no existing behaviour to preserve beyond "does
  nothing"). Implements the full WAI-ARIA APG listbox keyboard
  contract via a virtual cursor: two-way `activeIndex` (a `model()`
  signal, this catalog's established bindable-state idiom — see
  `picker-bar`'s own contract note), mirrored to `aria-activedescendant`,
  plus `clamp` (vs. wrap), `typeahead`, `pageSize` paging, and
  `activate`/`escape`/`tabOut` outputs.
- `aria-haspopup`/`aria-expanded`/`aria-controls`/`disabled` added to
  `IconButton` as named inputs (Angular has no generic
  spread-onto-inputs mechanism — see `picker-bar`'s own note on the
  same constraint — so these are explicit rather than a rest-prop
  spread); click/keydown wiring needs no new API at all, since a
  native `(click)`/`(keydown)` binding on `<lily-icon-button>` already
  catches events bubbling up from the real inner `<button>`.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-angular-headless` → `@lilydesignsystem/angular-headless`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-angular-headless`'s last published version (`0.1.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

## 0.2.0 — 2026-08-26

Angular 22 support. Built and verified on Angular 22.1 (ng-packagr
22.1, TypeScript 6.0, vitest 4, jsdom 30, Storybook 10); the peer
range widens to `>=20.0.0 <23.0.0`, so Angular 20 and 21 consumers are
unaffected. All 1,010 spec cases and the 491-story Storybook build
pass on the new toolchain. No component behaviour change.

## 0.1.1 — 2026-08-26

Fixed: **every typed input component rendered `type="text"`** — all 25
of them (radio, checkbox, date, email, file, password, range, tel, url,
week, and the rest), a generator artifact that survived because no spec
asserted an input's type. Radio buttons were text boxes to the browser
and to assistive technology. Each of the 25 now renders its canonical
type from `components/{slug}/AGENTS.md`, each spec asserts it (the new
assertions were seeded-fault-checked), and the suite grows 985 → 1,010
cases. Found via an axe `target-size` finding on the Angular example
app's settings page, whose "radios" were undersized text inputs.

## 0.1.0 — 2026-08-26

First published release: the Angular 20 headless component library (standalone, signal-based, OnPush),
covering all 491 catalog components with per-component tests.

Numbered 0.1.0 deliberately. In-tree version numbers existed before
this release, but nothing was ever published under this name, and a
first release numbered higher would imply registry history that never
existed — the same reasoning the helper packages recorded at their
July 2026 reset. Sibling packages (svelte, react, vue) are on their
own version lines.
