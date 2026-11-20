# DocumentListItem

## Metadata

- Component: document-list-item
- PascalCase: DocumentListItem
- Description: one document entry in a document list
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <li>
- CSS class: .document-list-item
- Interactive: no

## Key Behaviors

- Renders an `<li>` around the consumer's content: typically the document link, its file type and size, and an optional last-modified date
- The component builds no link or metadata; the consumer writes the `<a>` (with `download` when the browser should offer to save it) and any `<span>` details
- No `label`: an `aria-label` on the `<li>` would replace the link text a screen reader announces
- Spreads `restProps` onto the root `<li>`

## ARIA

- Native anchor and list-item semantics
- The link's accessible name combines the title and the file type/size when announced by screen readers

## Keyboard

- Tab moves focus onto the document link
- Enter activates the link (native browser behaviour)

## Props

- `children`: slot (required) (default: —) — The document link and its details
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<li>`

## Acceptance Criteria

- [ ] Renders <li> element with class="document-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

Not in the Web Components catalog, by design. A custom element between an `<ol>` or `<ul>` and its `<li>` breaks the
content model, and the only form that avoids it, a customized built-in element, does not work in Safari. Without a
framework, write the native element with this component's class hook, or use the HTML catalog's markup. See
[the Web Components spec](https://github.com/LilyDesignSystem/lily-design-system/blob/main/lily-design-system-web-components-headless/spec/index.md).

## References

- Documentation: index.md
- CSS class: `.document-list-item` in css-style-sheet-template.css
- [MDN download attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download)
