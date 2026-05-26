# Byline

## Metadata

- Component: byline
- PascalCase: Byline
- Description: an author attribution with publish and update timestamps
- HTML tag: <div>
- CSS class: .byline
- Interactive: no

## Key Behaviors

- Displays author attribution
- Supports publish and update timestamps using `<time>` elements
- Author names can be plain text or links
- Inspired by Reuters Graphics Byline component

## ARIA

- `<time datetime="">` for machine-readable dates
- `rel="author"` on author links

## Keyboard

- None (links within are natively focusable)

## Props

- `children`: slot (required) -- author names/links
- `published`: slot (optional) -- publish date/time
- `updated`: slot (optional) -- last updated date/time
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="byline"
- [ ] Renders children slot for author attribution
- [ ] Renders published slot for publish timestamp
- [ ] Renders updated slot for update timestamp
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .byline in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/byline.html
