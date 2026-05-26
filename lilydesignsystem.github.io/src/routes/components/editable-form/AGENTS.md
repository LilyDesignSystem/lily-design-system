# EditableForm

## Metadata

- Component: editable-form
- PascalCase: EditableForm
- Description: a form wrapper for inline editing of content
- HTML tag: <form>
- CSS class: .editable-form
- Interactive: yes

## Key Behaviors

- Conditionally renders a `<form>` only when `editing` is true
- Supports two-way binding on the `editing` prop for two-way state binding
- Calls `event.preventDefault()` on submit to allow consumer-controlled save logic
- Sets `editing` to `false` on both submit and Escape key press
- Sets `tabindex="-1"` on the form to allow programmatic focus management
- Escape key handler calls the `oncancel` callback

## ARIA

- `aria-label={label}` -- provides an accessible name for the form

## Keyboard

- Enter: submits the form (native form behavior), exits edit mode, calls `onsubmit`
- Escape: cancels editing, exits edit mode, calls `oncancel`

## Props

- `label`: string (required) -- accessible name for the form, applied as `aria-label`
- `editing`: boolean (default: false) -- whether the form is in edit mode, two-way bindable via `editing`
- `onsubmit`: (event: SubmitEvent) => void (default: undefined) -- callback when the form is submitted
- `oncancel`: () => void (default: undefined) -- callback when editing is cancelled
- `children`: slot (required) -- form content (inputs, buttons, etc.)

## Acceptance Criteria

- [ ] Renders <form> element with class="editable-form"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .editable-form in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/editable-form.html
- WAI-ARIA Form Role: https://www.w3.org/WAI/ARIA/apd/roles/form/
