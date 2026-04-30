# ValidationListItem

## Metadata

- Component: validation-list-item
- PascalCase: ValidationListItem
- Description: one validation rule in a validation list with a status of pending, passed, or failed
- HTML tag: <li>
- CSS class: .validation-list-item
- Interactive: no

## Key Behaviors

- Renders a `<li>` with class `validation-list-item`
- `status` prop is one of `"pending"`, `"passed"`, `"failed"` (default `"pending"`)
- `status` is rendered as `data-status` on the `<li>` for consumer styling
- Optional `label` sets `aria-label`
- Children render the rule text
- Pass-through attributes are forwarded to the root `<li>`
- Status announcements are driven by the parent `ValidationList`'s `aria-live="polite"`

## ARIA

- Implicit `listitem` role from the `<li>` element
- `aria-label` is rendered only when `label` is provided
- `data-status` exposes rule state for consumer styling

## Keyboard

- None — the item is not interactive
- Tab moves focus past the item

## Props

- `status`: `"pending" | "passed" | "failed"` (default: `"pending"`)
- `label`: string (optional) -- aria-label override
- `children`: slot -- rule text
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <li> element with class="validation-list-item"
- [ ] data-status defaults to "pending"
- [ ] data-status reflects the status prop value
- [ ] aria-label is rendered only when label is provided
- [ ] Children render inside the item
- [ ] Additional HTML attributes pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .validation-list-item in css-style-sheet-template.css
- US Web Design System Validation: https://designsystem.digital.gov/components/validation/
- WCAG 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color
