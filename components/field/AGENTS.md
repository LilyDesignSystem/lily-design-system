# Field

## Metadata

- Component: field
- PascalCase: Field
- Description: a form field wrapper with label, input, and error message
- HTML tag: <div>
- CSS class: .field
- Interactive: no

## Key Behaviors

- Renders a `<div>` wrapper containing a `<label>`, consumer-provided children, optional description `<p>`, and optional error `<p>`
- Auto-generates a unique ID using derived value if `inputId` is not provided
- Derives `descId` and `errorId` from the field ID for ARIA linking
- The `<label>` uses `for={fieldId}` to link to the consumer's input element
- Required indicator asterisk uses `aria-hidden="true"` to avoid screen reader noise
- Error paragraph uses `role="alert"` for live announcement
- Sets `data-required` attribute on the wrapper div when `required` is true

## ARIA

- `<label for={fieldId}>` -- links the visible label to the input element
- `role="alert"` -- on the error paragraph, announces the error message to screen readers
- `aria-hidden="true"` -- on the required asterisk, prevents screen readers from reading the decorative indicator
- `data-required` -- data attribute on the wrapper for consumer CSS styling

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- visible label text
- `description`: string (default: undefined) -- helper text displayed below the label
- `error`: string (default: undefined) -- error message displayed below the input
- `required`: boolean (default: false) -- whether the field is required, adds a visual asterisk
- `inputId`: string (default: undefined) -- ID of the input to link the label to; auto-generated if omitted
- `children`: slot (required) -- form control (input, select, text-area-input, etc.)

## Acceptance Criteria

- [ ] Renders <div> element with class="field"
- [ ] Has role="alert"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .field in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/field.html
- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
- WAI-ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21
