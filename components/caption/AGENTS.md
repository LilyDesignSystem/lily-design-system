# Caption

## Metadata

- Component: caption
- PascalCase: Caption
- Description: a caption for a table or figure element
- HTML tag: <caption>
- CSS class: .caption
- Interactive: no

## Key Behaviors

- Renders as a semantic `<figcaption>` element
- Designed for use within a `<figure>` parent element for proper semantic association
- Can be referenced via `id` and `aria-describedby` from other elements
- Uses `slot` for children content
- Spreads `...restProps` on the root `<figcaption>` element for consumer customization

## ARIA

- Implicit semantics from `<figcaption>` -- automatically associated with its parent `<figure>` element, providing an accessible caption without additional ARIA attributes

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- the caption text or content to display

## Acceptance Criteria

- [ ] Renders <caption> element with class="caption"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .caption in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/caption.html
