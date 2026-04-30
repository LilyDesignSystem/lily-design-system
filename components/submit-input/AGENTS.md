# SubmitInput

## Metadata

- Component: submit-input
- PascalCase: SubmitInput
- Description: a button input that submits a form <input type="submit">
- HTML tag: <input>
- CSS class: .submit-input
- Interactive: yes

## Key Behaviors

- Renders a single `<input type="submit">` element for native form submission behavior
- The browser automatically triggers the containing form's `submit` event when clicked
- Default button text is "Submit", configurable via the `value` prop
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `class`)
- No ARIA attributes needed beyond the native semantics of `<input type="submit">`
- When used within a form, clicking this input also triggers built-in browser validation

## Keyboard

- Enter: activates the submit button
- Space: activates the submit button

## Props

- `value`: string (default: "Submit") -- the visible button text
- `disabled`: boolean (default: false) -- whether the button is disabled
- `...restProps`: spread onto the `<input>` element

## ARIA

- Native `<input type="submit">` exposes itself as a `button` and is the form's default submit control
- `value` (or label override) provides the accessible name

## Acceptance Criteria

- [ ] Renders <input> element with class="submit-input"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .submit-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/submit-input.html
- MDN input type="submit": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/submit
