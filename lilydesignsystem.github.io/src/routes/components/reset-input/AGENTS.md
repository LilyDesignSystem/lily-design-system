# ResetInput

## Metadata

- Component: reset-input
- PascalCase: ResetInput
- Description: a button input that resets a form to default values <input type="reset">
- HTML tag: <input>
- CSS class: .reset-input
- Interactive: yes

## Key Behaviors

- Renders a single `<input type="reset">` element for native form reset behavior
- The browser automatically handles resetting all sibling form fields when clicked
- Default button text is "Reset", configurable via the `value` prop
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `class`)
- No ARIA attributes needed beyond the native semantics of `<input type="reset">`

## Keyboard

- Enter: activates the reset button
- Space: activates the reset button

## Props

- `value`: string (default: "Reset") -- the visible button text
- `disabled`: boolean (default: false) -- whether the button is disabled
- `...restProps`: spread onto the `<input>` element

## ARIA

- Native `<input type="reset">` exposes itself as a `button` to assistive technology
- `value` (or label override) provides the accessible name

## Acceptance Criteria

- [ ] Renders <input> element with class="reset-input"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .reset-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/reset-input.html
- MDN input type="reset": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/reset
