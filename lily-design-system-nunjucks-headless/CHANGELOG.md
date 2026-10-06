# Changelog — @lilydesignsystem/nunjucks-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).
The canonical monorepo history is in the root
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).

## 0.4.0 — 2026-10-06

**Breaking.** The `dateRange` macro renders a `<fieldset class="date-range">` of two date inputs; its params are now
`label`, `startLabel`, `endLabel`, `start`, `end`, `startName`, `endName`, `id`, `classes`, `attributes` (it was a
`<span>` of two `<time>`s with `startText`/`endText`/`separator`). The `reviewDate` macro renders a single
`<time class="review-date" datetime>`; its params are now `datetime`, `text`, `label`, `id`, `classes`, `attributes`
(the combined reviewed + next-review block is gone: call it twice). See the monorepo CHANGELOG.

## 0.3.0 — 2026-10-06

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

## 0.2.0 — 2026-10-05

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

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-nunjucks-headless` → `@lilydesignsystem/nunjucks-headless`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-nunjucks-headless`'s last published version (`0.1.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

## 0.1.0 — 2026-08-26

First published release: the Nunjucks macro library,
covering all 491 catalog components with per-component tests.

Numbered 0.1.0 deliberately. In-tree version numbers existed before
this release, but nothing was ever published under this name, and a
first release numbered higher would imply registry history that never
existed — the same reasoning the helper packages recorded at their
July 2026 reset. Sibling packages (svelte, react, vue) are on their
own version lines.
