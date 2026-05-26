# FileDialog

## Metadata

- Component: file-dialog
- PascalCase: FileDialog
- Description: a dialog for browsing and selecting files
- HTML tag: <dialog>
- CSS class: .file-dialog
- Interactive: yes

## Key Behaviors

- Conditionally renders a `<dialog open>` element only when `open` is true
- Supports two-way binding on the `open` prop for two-way state binding
- Uses the native `<dialog>` HTML element with the `open` attribute
- Sets `tabindex="-1"` to allow the dialog to receive focus programmatically
- Escape key handler sets `open` to `false`
- Spreads `restProps` onto the `<dialog>` for consumer customization

## ARIA

- `aria-label={label}` -- provides an accessible name for the dialog
- Native `<dialog>` element -- provides implicit `role="dialog"` semantics

## Keyboard

- Escape: closes the dialog by setting `open` to `false`

## Props

- `label`: string (required) -- accessible name for the dialog, applied as `aria-label`
- `open`: boolean (default: false) -- whether the dialog is visible, two-way bindable via `open`
- `children`: slot (required) -- dialog content

## Acceptance Criteria

- [ ] Renders <dialog> element with class="file-dialog"
- [ ] Has aria-label attribute
- [ ] Has role="dialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .file-dialog in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/file-dialog.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
