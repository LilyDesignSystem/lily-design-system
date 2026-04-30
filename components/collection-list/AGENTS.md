# CollectionList

## Metadata

- Component: collection-list
- PascalCase: CollectionList
- Description: a compact list of multiple related items such as articles or events
- HTML tag: <ul>
- CSS class: .collection-list
- Interactive: no

## Key Behaviors

- Renders a `<ul>` with class `collection-list`
- `label` prop is optional; when present it sets `aria-label`
- Children are expected to be `collection-list-item` elements
- The `<ul>` semantics provide list count and position to screen readers
- Pass-through attributes are forwarded to the root `<ul>`

## ARIA

- Implicit `list` role from the `<ul>` element
- `aria-label` is rendered only when `label` is provided

## Keyboard

- Tab: moves focus to interactive descendants of the items
- The list itself is not interactive

## Props

- `label`: string (optional) -- aria-label for the list
- `children`: slot -- `collection-list-item` children
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <ul> element with class="collection-list"
- [ ] aria-label is rendered only when label is provided
- [ ] Children render inside the list
- [ ] Additional HTML attributes pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .collection-list in css-style-sheet-template.css
- US Web Design System Collection: https://designsystem.digital.gov/components/collection/
- WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list
