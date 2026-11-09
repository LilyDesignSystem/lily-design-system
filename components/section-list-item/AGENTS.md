# SectionListItem

## Metadata

- Component: section-list-item
- PascalCase: SectionListItem
- Description: one section navigation item
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <li>
- CSS class: .section-list-item
- Interactive: no

## Key Behaviors

- Renders a `<li>` containing a `SectionLink`
- Used inside `SectionList`
- No `label`: an `aria-label` on the `<li>` would replace the link text a screen reader announces
- Spreads `restProps` onto the root `<li>`

## ARIA

- Native `<li>` semantics

## Keyboard

- No keyboard interactions on the list item itself; the inner link receives focus

## Props

- `current`: boolean (default: false) — Sets an empty `data-current` on the `<li>` for CSS; it sets no `aria-current`
- `children`: slot (required) (default: —) — Typically a single `SectionLink`
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<li>`

## Acceptance Criteria

- [ ] Renders <li> element with class="section-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.section-list-item` in css-style-sheet-template.css
- [MDN li element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)
