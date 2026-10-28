# Grid

A grid is a CSS grid layout container with a configurable number of columns
and gap, allowing consumers to lay out two-dimensional content without
writing custom grid CSS for every container.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

Use it for card grids, image galleries, dashboard tile layouts, and any
two-dimensional arrangement of content where you want explicit column control
and consistent gutters.

## Implementation Notes

- Renders a `<div>` with `class="grid"`
- If `columns` is a number, applies inline `grid-template-columns: repeat({columns}, minmax(0, 1fr));`
- If `columns` is a string, uses it as-is for `grid-template-columns`
- If `minColumnWidth` (a CSS length such as `12rem`) is set, applies `grid-template-columns: repeat(auto-fit, minmax(min({minColumnWidth}, 100%), 1fr));` instead. Precedence: `minColumnWidth` (a CSS length) wins over `columns` whenever it is set: `columns` has a default of 12, so "unset" cannot be told apart from "12".
- Always applies `display: grid` and `gap: {gap}`
- Sets `data-columns` for consumer CSS hooks, and `data-min-column-width` when `minColumnWidth` is set

## Props

- `columns`: number | string (default: 12) -- column count or `grid-template-columns` value
- `minColumnWidth`: string (optional CSS length) -- fluid mode: as many columns as fit, each at least this wide; replaces `columns`
- `gap`: string (default: "1rem") -- gap CSS value
- `children`: slot -- the laid-out content
- `...restProps`: any additional HTML attributes

## Usage

Twelve-column default grid:

```html
<Grid>
  <div>Item 1</div>
  <div>Item 2</div>
</Grid>
```

Three-column card grid:

```html
<Grid
  columns="{3}"
  gap="1.5rem"
>
  <Card>One</Card>
  <Card>Two</Card>
  <Card>Three</Card>
</Grid>
```

Custom track sizes:

```html
<Grid
  columns="200px 1fr 200px"
  gap="1rem"
>
  <aside>Left</aside>
  <main>Center</main>
  <aside>Right</aside>
</Grid>
```

Fluid card grid (two modes: fixed `columns`, or fluid `minColumnWidth`):

```html
<Grid minColumnWidth="12rem" gap="1rem">
  <Card>One</Card>
  <Card>Two</Card>
  <Card>Three</Card>
</Grid>
```

The `min(<W>, 100%)` inside `minmax()` matters in a narrow container. In a 120px-wide
container with `minColumnWidth="12rem"` (192px), a bare `minmax(12rem, 1fr)` would force
a 192px track and overflow the container, so the grid would scroll sideways. With
`min(12rem, 100%)` the track is capped at the container width (120px): one column, no
overflow (WCAG 1.4.10 Reflow). In a wide container the same markup yields as many
192px-or-wider columns as fit. Use `columns` when the count must stay fixed whatever the width.

## Keyboard Interactions

- None -- this is a layout container; focusable children manage their own keyboard behavior.

## ARIA

- None — purely structural. Do not confuse the `grid` CSS layout primitive with the WAI-ARIA `role="grid"` widget pattern (used by DataTable and similar components).

## When to Use

- Use for two-dimensional layouts of cards, tiles, or images.
- Use when columns should remain aligned across rows.
- Use when you want responsive column counts via consumer media queries.

## When Not to Use

- Do not use for one-dimensional row/column stacks (use FlexStack).
- Do not use for variable-height masonry layouts (use Masonry).
- Do not confuse with the WAI-ARIA grid widget — this is purely a layout helper.

## Headless

Provides only the CSS grid behavior via inline styles. Item placement, span
overrides, and responsive column count changes are the consumer's
responsibility, typically via media queries on `.grid` or descendant
selectors.

## Styles

Consumers may target `.grid` for responsive column overrides:

```css
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

## Testing

- Verify the component renders a `<div>` element with class `grid`
- Verify inline style sets `display: grid` and `gap: {gap}`
- Verify when `columns` is a number, `grid-template-columns` is `repeat(N, minmax(0, 1fr))`
- Verify when `columns` is a string, `grid-template-columns` matches it exactly
- Verify when `minColumnWidth` is set, `grid-template-columns` is `repeat(auto-fit, minmax(min(<W>, 100%), 1fr))` and wins over `columns`
- Verify `data-columns` attribute matches the `columns` prop
- Verify children content is rendered

## Advice

- **Designers**: Pick a small column count (3, 4, 6, 12) for predictable alignment. Reserve custom track strings for layouts where fixed-width sidebars or asymmetric tracks are required.
- **Developers**: Use the numeric `columns` API when the count must be fixed; use `minColumnWidth` when the count should follow the container (cards, galleries).  Drop down to the string API only when you need fixed tracks or named lines.

## Related components

- `flex-stack` — a flex layout container for vertical or horizontal stacking with consistent gap
- `container` — a generic block-level content container
- `masonry` — a masonry layout container for variable-height items

## References

- MDN grid-template-columns: https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns
- MDN CSS grid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

---

Lily™ and Lily Design System™ are trademarks.
