# Masonry

## Metadata

- Component: masonry
- PascalCase: Masonry
- Description: a masonry layout container for variable-height items
- HTML tag: <div>
- CSS class: .masonry
- Interactive: no

## Key Behaviors

- Inline style `column-count: {columns}; column-gap: {gap};`
- `data-columns` attribute mirrors prop for consumer CSS hooks
- Children flow top-down within each column
- Consumer CSS responsible for `break-inside: avoid` on items

## ARIA

- None — purely structural

## Keyboard

- None — focusable children manage their own keyboard behavior

## Props

- `columns`: number (default: 3) -- number of columns
- `gap`: string (default: "1rem") -- gap CSS value
- `children`: slot -- masonry items
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="masonry"
- [ ] Inline style sets column-count to columns prop
- [ ] Inline style sets column-gap to gap prop
- [ ] data-columns attribute matches columns prop
- [ ] Children content is preserved
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .masonry in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/masonry.html
- MDN column-count: https://developer.mozilla.org/en-US/docs/Web/CSS/column-count
