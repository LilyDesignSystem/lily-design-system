# Lessons from Stephcraft's "Responsive CSS" (planned work)

## Summary

Nine improvements to Lily, plus items not adopted, proposed 2026-10-28 from a
review of [Responsive CSS](https://stephcraft.net/docs/responsive), one page in
a personal documentation site on plain HTML and CSS. It is a guide, not a
library: it has no API, so the lessons are about technique and about what Lily
does not yet say. The page's central advice (design mobile first, prefer fluid
units to fixed breakpoints, use container queries for components, cap line
length, stop overflow) is sound and mostly already true of Lily's markup. What
Lily lacks is **a written responsive policy and the theme work that would
carry it out**: there is no responsive topic under `spec/`, the 57
`themes/` share one `@media (max-width: 48rem)` breakpoint and no container
queries, and the layout components only say "consider making sidebars
collapsible" in their advice. Nothing here is built yet: each item is an open
acceptance criterion.

## Scope

### In scope

The nine items below, each with a deliverable and a check; and what is
deliberately not adopted.

### Explicitly out of scope

- Shipping CSS in the headless layer. Every item that needs CSS lands in the
  `themes/`, the example apps or the docs, never in a headless library (root
  rule, [headless](../headless/index.md)).
- A CSS framework or utility classes ([theme](../theme/index.md)).
- Device detection or user-agent sniffing: the page's "device categories"
  (watch, mobile, tablet, laptop, desktop, TV) are a way to think, not a
  switch.

## Limits of the review

Read: the whole page, as served on 2026-10-28. Not read: any of the roughly
thirty pages it links to (MDN, web.dev, Utopia, Josh Comeau's full-bleed
article, Kevin Powell's breakpoint-free grid talk). The traffic split ("about
60% mobile, 40% desktop") and the framework breakpoint tables are the page's
own figures, not checked against StatCounter or each framework's docs. The page
has errors of its own, which this review does not repeat: its header example
uses `.menu` in the HTML and `.mobile` in the CSS; its video example names
image files with `type="video/mp4"` and closes a `<picture>` that was never
opened; its "Grid" reference link points to a Flexbox article.

## What Lily already matches

| The page says                                         | Lily today                                                                                                                                    |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Use semantic landmarks (`main`, `header`, `aside`, …) | Suffix-to-element table; `grail-layout` is `header`/`aside`/`main`/`aside`/`footer`.                                                          |
| Cap line length near 720px                            | `container-with-fixed-width` (a configurable maximum) and `container-with-fluid-width` (full width plus inline padding).                      |
| Centre with `margin-inline: auto`                     | `container-with-fluid-width` sets `padding-inline`; centring is the consumer's CSS.                                                           |
| Responsive grid without breakpoints                   | `grid` already accepts a string `columns`, so `repeat(auto-fit, minmax(min(150px, 100%), 1fr))` can be passed today (see item 4).             |
| Respect the viewer's device (`(hover: none)`)         | P10-T3 plans coarse-pointer target sizes; all 57 themes carry `prefers-reduced-motion`.                                                       |
| Breakpoints in `rem`, not `px`                        | The themes use `48rem` (Tailwind's `md`), so they already follow the viewer's font size.                                                      |
| A responsive test sweep                               | Every example app runs a four-viewport sweep (mobile, tablet, desktop, 4K) asserting no horizontal overflow ([testing](../testing/index.md)). |

## The items

### 1. A `responsive` topic and `AGENTS/responsive.md`

The gap behind every other item. Write one short rule file, loaded with the
other `AGENTS/*.md`, and one `spec/responsive/` topic. Rules to state, taken
from the page and checked against WCAG 2.2:

- Mobile first: the base rules are the narrow layout; queries add width.
- Prefer intrinsic sizing (`minmax()`, `min()`, `clamp()` for spacing, `flex-wrap`)
  to breakpoints; use a breakpoint only when the layout genuinely changes.
- Logical properties (`inline-size`, `margin-inline`) so right-to-left needs no
  second stylesheet ([internationalization](../internationalization/index.md)).
- Never `width: 100vw` on `body` (it adds a horizontal scrollbar).
- Reflow: no horizontal scrolling at 320 CSS pixels wide (WCAG 1.4.10), and
  text that still works at 400% zoom (1.4.4).

Check: `bin/check-links`; the new files appear in the AGENTS list in
`AGENTS.md`; a short test in `bin/test` that the rule file exists.

### 2. Container queries in the reference themes

The 57 themes answer every narrow-screen question with one viewport query, so a
component in a narrow sidebar on a wide screen gets the wide layout. The page's
fix is `container-type: inline-size` plus `@container (min-width: …)`.

Headless components cannot set `container-type` (it is a style decision), so
the theme sets it on the existing wrapper classes (`grail-layout-left-aside`,
`grail-layout-center-main`, `sidebar`, `card`) and the component-level queries
use `@container`. Start with the components that change shape most: `card`,
`summary-list`, `data-table`, `kanban-table` and the `calendar-*-table` family.

Check: `bin/check-theme` gains a rule that any theme using `@container` also
sets `container-type` on the container it queries; the responsive sweep (item 8) passes with the sidebar at its narrowest.

### 3. A documented breakpoint table

`@media` cannot read a custom property, so a `--lily-breakpoint-md` token would
be a lie. The page's answer is to pick numbers and write them down. Lily
should do the same: one table in the responsive topic, in `rem`, aligned with
a common scale so adopters moving between systems see no surprises. The page
lists Tailwind at `40rem`, `48rem`, `64rem`, `80rem` and `96rem`; Lily's themes
already use `48rem`.

Deliverable: the table, plus a `bin/check-theme` rule that every `@media`
width in a theme is in `rem` and is one of the table's values (today: one
theme, NHS Wales for patients, uses `40rem`, which the rule would flag for a decision).

### 4. A `minColumnWidth` mode for `grid`

`grid` takes a number (`repeat(n, minmax(0, 1fr))`) or a raw string. The common
responsive case, "as many columns as fit, none narrower than 150px", needs the
string `repeat(auto-fit, minmax(min(150px, 100%), 1fr))`, where the inner
`min(…, 100%)` is the part people forget and the reason a plain
`minmax(150px, 1fr)` overflows a 120px container.

Add an optional `minColumnWidth` prop (a CSS length) that generates that value,
leaving `columns` untouched for the fixed case. It is structural, so it sits
inside the existing inline-style allowance.

Check: a unit test per library for the generated value; the `grid` page
documents both modes; the 120px-container case is a demo.

### 5. A `picture` component, and image sizing guidance

The catalog has `image` and no `picture`. The page shows the two things
`<picture>` is for: art direction (`media="(orientation: portrait)"` sources)
and format fallback. Add `picture` (root `<picture>`, sources as children) to
the catalog and give `image` documented guidance: `display: block` to remove the
baseline gap, `max-inline-size: 100%` and `block-size: auto` to keep the aspect
ratio, and explicit `width` and `height` attributes so the page does not shift
as images load.

Check: `bin/new-component picture`; the catalog count and every count in the
specs move together; `image`'s Advice section names the three CSS lines.

### 6. Long-word and overflow rules in the themes

The page uses `overflow-wrap: anywhere` and `<wbr>`. Lily has a good reason to
care: national identifiers, email addresses and URLs have no break
opportunities, and the 140 identifier components put them in narrow cells.
`middle-truncation` already covers the case where the consumer wants an ellipsis.

Add to the themes, scoped (not on `body`): `overflow-wrap: anywhere` on table
cells, summary-list values and the identifier `-view` components; and
`min-inline-size: 0` on grid and flex children, the usual cause of overflow.

Check: a Playwright case per example app putting a 60-character unbroken string
in a `summary-list` and a `data-table` at 320px, asserting no horizontal scroll.

### 7. A collapse-priority contract for `grail-layout`

The page hides its table-of-contents aside first and its documents aside last as
the window narrows. `grail-layout`'s docs say only "consider making sidebars
collapsible". State a contract instead: which region goes first (right aside,
then left aside), what it becomes (hidden, or moved after `main` in source
order, never reordered visually only), and that the content stays reachable.

Deliverable: the contract in `grail-layout`'s `AGENTS.md`; the themes implement
it with a container query (item 2); a demo at three widths.

Check: reading order equals visual order at every width (WCAG 1.3.2 and 2.4.3),
asserted in the responsive sweep.

### 8. Strengthen the responsive sweep

The sweep checks four viewports for overflow, a skip link, `<main>` and an
`<h1>`. Add the two cases that WCAG names and the page does not: 320 CSS pixels
wide (the 1.4.10 reflow width) and 400% browser zoom (1.4.4). Add a narrow-
container case for item 2.

Check: the added widths are in every app's sweep and in
[testing](../testing/index.md)'s table.

### 9. Fluid spacing, not fluid text

The page's fluid type is `clamp(0.75rem, 0.75rem + 1vw, 1rem)`. Do not adopt it
for text (see below), but the same technique suits **spacing**: padding and gap
that grow with the viewport and never shrink below a floor. Add fluid spacing
tokens to the themes' token blocks, generated by `bin/generate-theme-tokens`,
and use them for container padding and section gaps.

Check: `bin/generate-theme-tokens --check`; `bin/check-theme` confirms every
fluid value has a `rem` floor.

## Not adopted

- **Fluid body text that shrinks below 1rem.** The page's `clamp()` starts at
  `0.75rem`, 12px, on small screens. That is smaller than the browser default,
  works against WCAG 1.4.4 and the AAA target, and fights `text-size-picker`,
  whose seven-step scale is the viewer's choice. Lily's text sizes stay under
  the viewer's control; only spacing is fluid (item 9).
- **`ul, li { display: contents }` to remove list styling.** In some
  browsers this has removed the list semantics from the accessibility tree
  (a long-standing bug; check the current state before relying on it either way).
  Reset the markers with `list-style: none` and keep the list a list.
- **A checkbox as the mobile menu toggle.** The page hides navigation behind a
  checkbox and `:has(:not(:checked))`. A checkbox announces as a form control,
  not a menu, and gives no `aria-expanded`. `menu-picker` is the contract: an
  icon button with `aria-expanded` and `aria-controls`.
- **`overflow-wrap: anywhere` on `body`.** It breaks ordinary words in tables
  and headings. Scope it (item 6).
- **Conditional stylesheet loading by `media` attribute.** The page offers it as
  an optimisation. Browsers still download non-matching stylesheets, and the
  `theme-picker` already swaps one managed `<link>`; splitting it per breakpoint
  adds requests and a flash for no saving.
- **Device categories as a design input.** Lily designs for widths and input
  capabilities (`hover`, `pointer`), not device names.

## Acceptance criteria

- [ ] 1. `AGENTS/responsive.md` and `spec/responsive/` exist, are listed in `AGENTS.md` and `spec/index.md`, and state the five rules.
- [ ] 2. The themes use `@container` for the five named components; `bin/check-theme` enforces `container-type` alongside it.
- [ ] 3. The breakpoint table is published and `bin/check-theme` enforces it; the `40rem` theme is decided.
- [ ] 4. `grid` has `minColumnWidth` in all eight libraries, tested.
- [ ] 5. `picture` is in the catalog and all eight libraries; `image`'s advice covers sizing.
- [ ] 6. The themes carry the scoped overflow rules; every example app tests the 60-character case at 320px.
- [ ] 7. `grail-layout`'s collapse contract is documented, implemented and tested for reading order.
- [ ] 8. The sweep includes 320px and 400% zoom in all example apps.
- [ ] 9. Fluid spacing tokens are generated and checked.

## Related topics

[theme](../theme/index.md), [components](../components/index.md),
[accessibility](../accessibility/index.md),
[internationalization](../internationalization/index.md),
[testing](../testing/index.md), [examples](../examples/index.md),
[headless](../headless/index.md),
[chanhdai-lessons](../chanhdai-lessons/index.md),
[daisyui-lessons](../daisyui-lessons/index.md),
[citations](../citations/index.md).

## Sources

- [Stephcraft: Responsive CSS](https://stephcraft.net/docs/responsive) (read 2026-10-28).
- Lily's own state, measured 2026-10-28: the 57 [themes/](../../themes/) (`@media (max-width: 48rem)` in every file, one `40rem` query in NHS Wales for patients, no `@container`); [grid](../../components/grid/AGENTS.md); [grail-layout](../../components/grail-layout/index.md); [container-with-fixed-width](../../components/container-with-fixed-width/index.md).
- [WCAG 2.2: 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) and [1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
