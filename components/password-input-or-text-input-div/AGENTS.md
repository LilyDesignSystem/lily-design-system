# PasswordInputOrTextInputDiv

## Metadata

- Component: password-input-or-text-input-div
- PascalCase: PasswordInputOrTextInputDiv
- Description: an input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle
- HTML tag: <div>
- CSS class: .password-input-or-text-input-div
- Interactive: yes

## Key Behaviors

- Renders a wrapper `<div>` containing the password input and an optional toggle button
- The input type dynamically switches between `"password"` and `"text"` based on the `visible` state
- Uses reactive state to track password visibility internally
- Supports two-way binding on the `value` prop
- The toggle button uses `aria-pressed` to indicate the current visibility state
- Includes `autocomplete="current-password"` on the input for browser password manager support
- Supports `required` and `disabled` boolean states on the input
- Spreads `restProps` onto the wrapper `<div>` for consumer customization

## ARIA

- `aria-label={label}` -- provides an accessible name for the password input
- `aria-label={toggleLabel}` -- provides an accessible name for the toggle button
- `aria-pressed={visible}` -- indicates whether the password is currently visible (on the toggle button)

## Keyboard

- Enter/Space on the toggle button: Toggles password visibility between masked and plain text

## Props

- `label`: string (required) -- accessible name for the password input via `aria-label`
- `value`: string (default: `""`) -- current password value; bindable with two-way `value` binding
- `showToggle`: boolean (default: `true`) -- whether to render the show/hide toggle button
- `toggleLabel`: string (default: `"Show password"`) -- accessible label for the toggle button
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="password-input-or-text-input-div"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .password-input-or-text-input-div in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/password-input-or-text-input-div.html
- HTML password input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
- WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/
