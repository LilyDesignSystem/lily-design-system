# Popover

## Metadata

- Component: popover
- PascalCase: Popover
- Description: a floating content box anchored to a trigger element
- HTML tag: <div>
- CSS class: .popover
- Interactive: yes

## Key Behaviors

- Conditionally renders a `<div>` with `role="dialog"` only when `open` is true
- Supports two-way binding on the `open` prop
- The `label` prop provides the dialog's accessible name via `aria-label`
- Rest props are spread onto the `<div>` element
- The consumer must provide their own trigger element and open/close logic
- Content is provided via the `children` slot

## ARIA

- `role="dialog"` -- identifies the popover as a dialog overlay for assistive technology
- `aria-label="..."` -- provides the accessible name for the dialog

## Keyboard

- Escape: Consumer should implement closing the popover by setting `open` to false
- Tab: Should trap focus within the popover when open (consumer responsibility)

## Props

- `label`: string (required) -- accessible name for the popover dialog via `aria-label`
- `open`: boolean (default: false, bindable) -- controls whether the popover is visible; supports two-way binding
- `children`: slot (required) -- the popover content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="popover"
- [ ] Has aria-label attribute
- [ ] Has role="dialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .popover in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/popover.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
