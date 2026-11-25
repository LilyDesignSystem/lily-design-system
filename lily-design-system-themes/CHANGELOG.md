# Changelog — @lilydesignsystem/themes

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/) and the package follows
[Semantic Versioning](https://semver.org/). Each entry names the components, hooks and tokens whose rules changed, and marks
anything that can change how an existing page lays out. The monorepo's root
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md) has the reasoning behind each change.

## Unreleased

- **Fixed (layout):** a `<time>`, a `<data>` or a clinical view component (`observation-view`, `medication-view`, `age-view`,
  `duration-view`, `early-warning-score-view`) in a table data cell keeps its words and numbers whole, and inside a
  `horizontal-scroller` every data cell does: 09:00 was shown as "09:0" over "0". **Watch for:** such a column is now at least as wide
  as its longest word, so a table holding one can need a `horizontal-scroller` on a narrow screen. Components: `table`, `data-table`.

## 0.9.0 — 2026-11-23

- **Added:** `light-high-contrast` and `dark-high-contrast`, accessible themes meeting WCAG 2.2 AAA (7:1 text and a heavy focus ring), 65 themes in all.

## 0.8.0 — 2026-11-22

- **Fixed:** a link inside `.hero` takes the hero's text colour (`color: inherit`, underlined), and so do the headings, so it is
  never the banner's own fill on the banner. `.hero` children with a `max-inline-size` are centred (`margin-inline: auto`).
  Components: `hero`.
- **Added:** `--lily-link`, a link colour with at least 4.5:1 against the page and the card surface in every theme, checked by
  `bin/check-theme`; use it for links in your own CSS instead of `--color-primary`, which is a fill. Tokens: `--lily-link`.

## 0.7.0 — 2026-11-21

- **Changed (layout):** table header cells, and links and code inside them, use `overflow-wrap: break-word` instead of `anywhere`,
  so a one-word header is no longer split mid-word ("Patie/nt"). A column is now at least as wide as its header's longest word,
  which raises the minimum content width of a `table`, `data-table` and anything that holds one. **Watch for:** a page whose layout
  is a single `1fr` grid column holding a table can grow wider than a 320px screen (a 47px sideways scroll was seen); the page needs both: write
  the column as `minmax(0, 1fr)` (a bare `1fr` track will not shrink below its content) and put the table in a labelled
  `horizontal-scroller` (measured at 320px; either alone still widens the page). Data cells keep `anywhere`. Components: `table`,
  `data-table`, `calendar-table`, `kanban-table`.
- **Added:** a shared "Whole-card link" section: a link marked `data-lily-card-link` in a card's heading makes the whole `card` its
  target, keeps other controls above it, and draws the focus ring round the card. Components: `card`.

## 0.6.2 — 2026-11-06 and earlier

See the root [CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md). Versions 0.6.0
(2026-10-24), 0.6.1 (2026-11-05) and 0.6.2 (2026-11-06) were published without an entry here.
