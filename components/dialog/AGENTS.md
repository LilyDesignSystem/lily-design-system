# Dialog

## Metadata

- Component: dialog
- PascalCase: Dialog
- Description: a modal or non-modal dialog window
- HTML tag: <dialog>
- CSS class: .dialog
- Interactive: yes

## Key Behaviors

- Renders a native `<dialog>` element conditionally via conditional rendering
- Supports two-way binding on the `open` prop with the parent
- The `open` HTML attribute is set directly on the dialog element (not using `.showModal()`)
- `tabindex="-1"` is set on the dialog to ensure it can receive focus and keyboard events
- Escape key handler sets `open` to false and prevents default browser behavior
- The `modal` prop controls whether `aria-modal` is set (defaults to true)
- When `modal` is false, `aria-modal` is omitted entirely (set to `undefined`)
- Accepts a `children` slot for dialog content including buttons, forms, or text
- Spreads `restProps` onto the `<dialog>` element for consumer customization

## ARIA

- `role="dialog"` -- provided natively by the `<dialog>` element
- `aria-label="{label}"` -- provides an accessible name for the dialog
- `aria-modal="true"` -- present when the `modal` prop is true, indicating the dialog traps focus and blocks background interaction
- `tabindex="-1"` -- allows the dialog element itself to receive focus for keyboard event handling

## Keyboard

- Escape: closes the dialog by setting `open` to false

## Props

- `open`: boolean (default: false) -- whether the dialog is visible; bindable
- `label`: string (required) -- accessible name for the dialog
- `modal`: boolean (default: true) -- whether the dialog behaves as a modal
- `children`: slot (required) -- dialog body content

## Acceptance Criteria

- [ ] Renders <dialog> element with class="dialog"
- [ ] Has aria-label attribute
- [ ] Has role="dialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .dialog in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/dialog.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
