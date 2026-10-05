# OneTimePasswordInput

## Metadata

- Component: one-time-password-input
- PascalCase: OneTimePasswordInput
- Description: a single one-time-password input with a numeric keypad, SMS autofill, and a fixed length
- Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)
- HTML tag: <input>
- CSS class: .one-time-password-input
- Interactive: yes

## Key Behaviors

- Renders one native `<input>` (not segmented boxes) so SMS autofill and paste work
- `autocomplete="one-time-code"`, `inputmode="numeric"` (overridable), `pattern="[0-9]*"` (overridable)
- `maxlength` and `data-length` come from the required `length` prop
- `aria-label` carries the label; `value` is bindable

## ARIA

- `aria-label={label}` -- provides the accessible name when no visible `<label>` is associated
- `autocomplete="one-time-code"` -- WCAG 1.3.5 input purpose, lets the platform offer the received code

## Keyboard

- None beyond native input behaviour -- standard text editing keys; Tab moves focus in and out

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `label`: string (required) -- accessible name via `aria-label`
- `length`: number (required) -- number of characters in the code; sets `maxlength` and `data-length`
- `value`: string (default: `""`) -- bindable value
- `inputMode`: string (default: `"numeric"`) -- virtual keyboard hint; use `"text"` for alphanumeric codes
- `pattern`: string (default: `"[0-9]*"`) -- allowed characters
- `name`: string (optional) -- form field name
- `required`: boolean (default: `false`)
- `disabled`: boolean (default: `false`)
- `...restProps`: unknown -- additional attributes spread onto the `<input>`

## Acceptance Criteria

- [ ] Renders `<input>` with class="one-time-password-input"
- [ ] Has aria-label, autocomplete="one-time-code", inputmode, maxlength, data-length
- [ ] Typing is limited to `length` characters
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .one-time-password-input in css-style-sheet-template.css
