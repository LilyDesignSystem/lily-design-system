# IconList

## Metadata

- Component: icon-list
- PascalCase: IconList
- Description: an ordered list of icon list item components
- HTML tag: <ul>
- CSS class: .icon-list
- Interactive: no

## Key Behaviors

- Renders a `<ul>` with class `icon-list`
- `label` prop is optional; when present it sets `aria-label`
- Children are expected to be `icon-list-item` elements
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
- `children`: slot -- `icon-list-item` children
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <ul> element with class="icon-list"
- [ ] aria-label is rendered only when label is provided
- [ ] Children render inside the list
- [ ] Additional HTML attributes pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .icon-list in css-style-sheet-template.css
- US Web Design System Icon List: https://designsystem.digital.gov/components/icon-list/
- WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list
