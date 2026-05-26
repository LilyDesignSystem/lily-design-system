# Grid

## Metadata

- Component: grid
- PascalCase: Grid
- Description: a CSS grid layout container with configurable columns and gap
- HTML tag: <div>
- CSS class: .grid
- Interactive: no

## Key Behaviors

- Inline style sets `display: grid` and `gap: {gap}`
- Numeric `columns` becomes `repeat({columns}, minmax(0, 1fr))`
- String `columns` is used as-is for grid-template-columns
- `data-columns` attribute mirrors the prop for consumer CSS hooks
- No padding, item placement, or visual treatment is applied

## ARIA

- None — purely structural CSS layout (NOT the WAI-ARIA grid widget)

## Keyboard

- None — focusable children manage their own keyboard behavior

## Props

- `columns`: number | string (default: 12) -- column count or grid-template-columns value
- `gap`: string (default: "1rem") -- gap CSS value
- `children`: slot -- laid-out content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="grid"
- [ ] Inline style sets display: grid
- [ ] Inline style sets gap to gap prop
- [ ] Numeric columns produces repeat(N, minmax(0, 1fr))
- [ ] String columns is used verbatim for grid-template-columns
- [ ] data-columns attribute matches columns prop
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .grid in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/grid.html
- MDN CSS grid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
