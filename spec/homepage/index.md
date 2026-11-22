# Homepage

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** The home page of the docs site shows its hero, then **exactly six tile cards**, immediately after it. Six is chosen
because it divides evenly into every column count the page uses: 1×6, 2×3, 3×2 or 6×1. A grid of six never leaves a short last row.

## Scope

This topic covers the structure of the home page of the docs site ([lilydesignsystem.com](https://lilydesignsystem.com/)): what
follows the hero, how many tiles there are, and how they are arranged at each width. It applies to the home page of every language
and region (for example [`/en-us/`](https://lilydesignsystem.com/en-us/), `/en-001/`, `/cy-gb/`) and to `/`, because they all render
one component (`LocaleHome`). It does not cover the hero's own wording, the site header or footer, or any other page; the site's
routes and build are in the site's own `AGENTS.md` and [monorepo-github-pages](../monorepo-github-pages/index.md).

## Principles and rules

- **Exactly six tiles.** Not five, not seven. A tile is one card that is one link.
- **Immediately after the hero.** No section, banner or content sits between the hero and the tiles. The hero is the `page-intro`
  section: the heading, the tagline and the framework icon row. Anything else on the home page comes after the six tiles.
- **Six because it tiles.** The divisors of six are 1, 2, 3 and 6, so six tiles make a complete rectangle at four column counts:
  - 1 column by 6 rows (a phone);
  - 2 columns by 3 rows (a narrow tablet);
  - 3 columns by 2 rows (a tablet or a laptop);
  - 6 columns by 1 row (a wide display).
- **Never 4 or 5 columns.** At those counts six tiles leave an orphan row (4+2 or 5+1). The grid therefore does not use `auto-fit`
  with a fixed minimum width, which would choose four or five columns at some widths; it sets the column count explicitly.
- **The column count follows the container, not the window,** with breakpoints in `rem` (see [responsive](../responsive/index.md)).
  The tiles keep a minimum inline size of about 14rem with 1.5rem between them, so the starting points are: one column below about 30rem; two from 30rem;
  three from 46rem; six from 92rem. Tune the numbers, keep the column counts.
- **A tile is a whole-card link.** One link in the heading makes the whole tile its target (the
  [whole-card link pattern](../../AGENTS/components.md)); the tile holds a heading and one short description, and nothing else that
  can be focused.
- **No icon carries meaning alone.** If a tile has an icon, it is decoration (`aria-hidden`); the heading is the name.
- **All text is localised.** A tile's heading and description come from the site's per-language strings, like the hero's. A language
  without a translation shows the English words for that tile, never a blank or a key.
- **Reflow.** No horizontal scrolling at 320 CSS pixels and at 400 percent zoom, and at the largest text size.

## The six tiles

The set is the maintainers' choice. Today's home page has three (tutorials, components, examples). A proposal for the six, to be
confirmed before the change is made:

| Tile          | Goes to                | Why it is on the home page                                       |
| ------------- | ---------------------- | ---------------------------------------------------------------- |
| Components    | `/components/`         | The catalogue is the product.                                    |
| Tutorials     | the tutorials page     | The way in for a developer.                                      |
| Examples      | the examples page      | Working pages, in many frameworks and in health care.            |
| Styles        | `/en-001/styles/`      | Principles, colours, typographies, icons, layouts and templates. |
| Compare       | the compare page       | How Lily relates to other design systems, said fairly.           |
| Accessibility | the accessibility page | What is verified, what is not, and how to report a problem.      |

A change to the set keeps the number at six. To add a tile, remove one.

## Today (2026-11-21)

The six tiles are built (task [P41-T8](../../tasks.md)): `HomeTiles.svelte`, rendered by `LocaleHome` (every language) and by the
English home at `/`, immediately after the hero. The set is the proposal above: Tutorials, Components, Examples, Styles, Compare,
Accessibility. `/` is its own page, not `LocaleHome`, so it renders `HomeTiles` itself.

- **Column counts.** `.tile-grid` in `style.css` sets 1 column, 2 from a container width of 30rem, 3 from 46rem, and 6 from a
  _viewport_ of 100rem. The sixth step is on the viewport, not the container, on purpose: the site's main column is capped at
  `--lily-content-max` (72rem), so a container is the same width at 1280 and at 1920 pixels and cannot tell 3 from 6. This
  is a page-shell decision, which [responsive](../responsive/index.md) allows for the window. At 6 columns the tiles are about
  10rem wide, so the minimum of 14rem above holds for 1 to 3 columns only.
- **Words.** The three older tiles' strings are in every language; `styles`, `compare` and `accessibility` are optional in
  `UiStrings`, and `homeTile(locale, tile)` returns the English words for a language without them. Translating them is open.
- **Whole-tile link.** The link is in the heading, carries `data-lily-card-link`, and `style.css` stretches it over the tile itself
  (the themes' rule does the same once a theme has loaded).
- **Test.** `tests/home-tiles.spec.ts`: every locale home plus `/` has six tiles directly after the hero, each one link with a heading
  and a description, no raw key; the column counts at 320, 768, 1280 and 1920 pixels on five homes; the tiles do not scroll sideways at
  the largest text size.
- **Reflow.** Every home, in every language, does not scroll sideways at 320 pixels at the largest text size (`tests/home-tiles.spec.ts`, 117 routes). Found and fixed on the way (P41-T8b): the header's picker bar had `flex-shrink: 0` and could not wrap its six pickers; a long word in a heading or the hero's tagline (Welsh, Finnish, Tamil) had no break; the English home's card grid and component list asked for `16rem` tracks; and ten framework icons (Solid joined) needed 904px for one row, so a link is now 4.5rem.

## Acceptance criteria

- [x] The home page of every language, and `/`, has exactly six tile cards in the first section after the hero, with nothing between
      the hero and the tiles (a Playwright test over every locale home, `tests/locale-pages.spec.ts` or its own spec).
- [x] At widths of 320, 768, 1280 and 1920 CSS pixels, the tile grid has 1, 2, 3 and 6 columns respectively, and never 4 or 5; the
      test reads the computed `grid-template-columns` and counts the tracks.
- [x] Each tile is one link with a heading and one description, and the whole tile is its target.
- [ ] No horizontal scrolling at 320 pixels, at 400 percent zoom, or at the largest text size.
- [ ] Every tile's text comes from the per-language strings, with the English words as the fallback.
- [x] The six-tile rule is stated in the site's `AGENTS.md`, so a later change does not quietly add a seventh.

## Related topics

[responsive](../responsive/index.md) · [internationalization](../internationalization/index.md) ·
[accessibility](../accessibility/index.md) · [monorepo-github-pages](../monorepo-github-pages/index.md) ·
[visual-identity](../visual-identity/index.md)

## Sources

- The home page component: [`LocaleHome.svelte`](../../lilydesignsystem.github.io/src/lib/components/LocaleHome.svelte)
- The grid: [`style.css`](../../lilydesignsystem.github.io/static/assets/style.css) (`.card-grid`)
- The whole-card link pattern: [AGENTS/components.md](../../AGENTS/components.md)

---

Lily™ and Lily Design System™ are trademarks.
