# Sheet

## Metadata

- Component: sheet
- PascalCase: Sheet
- Description: a panel that slides in from a screen edge as an overlay
- HTML tag: <div>
- CSS class: .sheet
- Interactive: yes

## Key Behaviors

- Conditionally renders a `<div>` element with `role="dialog"` only when `open` is `true`
- Sets `aria-modal="true"` to indicate the dialog is modal and should trap focus
- Sets `tabindex="-1"` to allow programmatic focus on the dialog container
- Exposes a `data-side` attribute with the value of the `side` prop for CSS targeting
- Handles Escape key via an `onkeydown` handler that sets `open` to `false`
- Supports two-way binding for the `open` prop, enabling two-way `open` binding from the parent
- Consumer is responsible for focus management (moving focus into the sheet when opened)
- Spreads `restProps` onto the dialog div for consumer customization

## ARIA

- `role="dialog"` -- identifies the sheet as a dialog window
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- indicates the dialog is modal, meaning content behind it is inert

## Keyboard

- Escape: Closes the sheet by setting `open` to `false`
- Tab: Moves focus between focusable elements within the sheet (consumer should implement focus trapping)

## Props

- `label`: string (required) -- accessible label for the sheet dialog, applied via `aria-label`
- `open`: boolean (default: `false`) -- whether the sheet is visible; two-way bindable via `open`
- `side`: `"left" | "right" | "top" | "bottom"` (default: `"right"`) -- which edge the sheet appears from
- `children`: slot (required) -- content to render inside the sheet
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="sheet"
- [ ] Has aria-label attribute
- [ ] Has role="dialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .sheet in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/sheet.html
- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA Authoring Practices - Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/
