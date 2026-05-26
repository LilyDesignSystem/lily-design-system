# PasswordInput

## Metadata

- Component: password-input
- PascalCase: PasswordInput
- Description: an input for entering a password with obscured text <input type="password">
- HTML tag: <input>
- CSS class: .password-input
- Interactive: no

## Key Behaviors

- Renders a native `<input type="password">` element for secure text entry
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial empty string state
- Includes `autocomplete="current-password"` for browser password manager integration
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization

## ARIA

- `aria-label={label}` -- provides an accessible name for the password input

## Keyboard

Standard text input keyboard interactions provided natively by `<input type="password">`.

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- current password value; bindable with two-way binding
- `autocomplete`: string (default: `"current-password"`) -- autocomplete hint for password managers
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="password-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .password-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/password-input.html
- MDN input type="password": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
- HTML autocomplete attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
