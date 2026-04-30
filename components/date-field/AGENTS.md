# DateField

## Metadata

- Component: date-field
- PascalCase: DateField
- Description: a structured field for entering date components
- HTML tag: <div>
- CSS class: .date-field
- Interactive: no

## Key Behaviors

- Renders a `<div>` wrapper containing a `<label>`, `<input type="date">`, optional description `<p>`, and optional error `<p>`
- Auto-generates a unique ID for the input if none is provided, using derived value for reactivity
- Derives `descriptionId` and `errorId` from the input ID for ARIA linking
- Supports two-way binding on the `value` prop
- Error paragraph uses `role="alert"` for live announcement to screen readers

## ARIA

- `<label for={inputId}>` -- links the visible label to the input
- `aria-describedby={descriptionId}` -- links the input to its description text when present
- `aria-invalid="true"` -- indicates the input contains an invalid value when an error is present
- `aria-errormessage={errorId}` -- links the input to its error message when present
- `role="alert"` -- on the error paragraph, announces the error message to screen readers

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- visible label text for the date field
- `value`: string (default: "") -- current date value in YYYY-MM-DD format, two-way bindable via `value`
- `description`: string (default: undefined) -- helper text displayed below the input
- `error`: string (default: undefined) -- error message displayed when validation fails
- `required`: boolean (default: false) -- whether the field is required
- `disabled`: boolean (default: false) -- whether the field is disabled
- `id`: string (default: undefined) -- custom ID for the input element; auto-generated if omitted

## Acceptance Criteria

- [ ] Renders <div> element with class="date-field"
- [ ] Has role="alert"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .date-field in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/date-field.html
- ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21
- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
