# SectionList

## Metadata

- Component: section-list
- PascalCase: SectionList
- Description: a list of section navigation items
- HTML tag: <ol>
- CSS class: .section-list
- Interactive: no

## Key Behaviors

- Renders an `<ol>` containing `SectionListItem` children
- Used inside `SectionNav` to enumerate the section's pages
- Spreads `restProps` onto the root `<ol>`

## ARIA

- Native ordered list semantics announce the count of items

## Keyboard

- No keyboard interactions on the list itself

## Props

- `children`: slot (required) (default: —) — `SectionListItem` elements
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<ol>`

## Acceptance Criteria

- [ ] Renders <ol> element with class="section-list"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.section-list` in css-style-sheet-template.css
- [MDN ol element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
