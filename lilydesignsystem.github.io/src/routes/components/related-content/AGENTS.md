# RelatedContent

## Metadata

- Component: related-content
- PascalCase: RelatedContent
- Description: a section providing links to related or supporting information
- HTML tag: <aside>
- CSS class: .related-content
- Interactive: no

## Key Behaviors

- Renders an `<aside>` with a heading and a list of related links
- Heading level is configurable via `headingLevel` (default `<h2>`)
- Links are passed via the `children` slot; consumers compose them with `<a>` or `ContentsLink` etc.
- Spreads `restProps` onto the root `<aside>`

## ARIA

- `<aside>` is a complementary landmark and is announced as such by screen readers
- `aria-labelledby` ties the aside to its heading

## Keyboard

- Native anchor keyboard behaviour for each link

## Props

- `title`: string (required) (default: —) — Heading text
- `headingLevel`: 1 | 2 | 3 | 4 | 5 | 6 (default: 2) — Heading level
- `children`: slot (required) (default: —) — Related links
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<aside>`

## Acceptance Criteria

- [ ] Renders <aside> element with class="related-content"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.related-content` in css-style-sheet-template.css
- [MDN aside element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside)
