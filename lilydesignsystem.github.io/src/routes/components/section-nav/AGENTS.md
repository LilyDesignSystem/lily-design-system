# SectionNav

## Metadata

- Component: section-nav
- PascalCase: SectionNav
- Description: a navigation container for section navigation links
- HTML tag: <nav>
- CSS class: .section-nav
- Interactive: no

## Key Behaviors

- Renders a `<nav>` landmark with `aria-label` to identify it (e.g. "In this section")
- Wraps a `SectionList` of `SectionListItem` containing `SectionLink` children
- Companion components: `SectionList`, `SectionListItem`, `SectionLink`
- Spreads `restProps` onto the root `<nav>`

## ARIA

- `<nav>` element is a navigation landmark
- `aria-label` (from `label`) names the landmark
- `aria-current="page"` should be applied by the consumer to the current `SectionLink`

## Keyboard

- Tab moves focus through the contained links

## Props

- `label`: string (required) (default: —) — Accessible label for the navigation landmark
- `children`: slot (required) (default: —) — The `SectionList` and its children
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<nav>`

## Acceptance Criteria

- [ ] Renders <nav> element with class="section-nav"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.section-nav` in css-style-sheet-template.css
- [MDN nav element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)
