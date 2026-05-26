# Popup

## Metadata

- Component: popup
- PascalCase: Popup
- Description: a temporary overlay that appears above page content
- HTML tag: <div>
- CSS class: .popup
- Interactive: yes

## Key Behaviors

- Conditionally renders a `<div>` with `role="dialog"` only when `open` is true
- Supports two-way binding on the `open` prop
- The `label` prop is required and provides the dialog's accessible name via `aria-label`
- Rest props are spread onto the `<div>` element
- The consumer must provide their own trigger element and manage open/close behavior
- Content is provided via the `children` slot

## ARIA

- `role="dialog"` -- identifies the popup as a dialog overlay for assistive technology
- `aria-label="..."` -- provides the accessible name for the dialog

## Keyboard

- Escape: Consumer should implement closing the popup by setting `open` to false
- Tab: Should trap focus within the popup when open (consumer responsibility)

## Props

- `label`: string (required) -- accessible name for the popup dialog via `aria-label`
- `open`: boolean (default: false, bindable) -- controls whether the popup is visible; supports two-way binding
- `children`: slot (required) -- the popup content rendered inside the dialog
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="popup"
- [ ] Has aria-label attribute
- [ ] Has role="dialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .popup in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/popup.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
