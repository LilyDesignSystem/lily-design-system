# EmailInput

## Metadata

- Component: email-input
- PascalCase: EmailInput
- Description: an input for entering an email address <input type="email">
- HTML tag: <input>
- CSS class: .email-input
- Interactive: no

## Companion

- email-link

## Key Behaviors

- Renders a native `<input type="email">` element for browser-native email validation
- Supports two-way binding of the email string
- Provides `aria-label` for screen reader accessibility
- Supports `required` and `disabled` for standard form behavior
- Spreads `restProps` for consumer customization
- Unlike EmailAddressInput, does not set `autocomplete` or support `placeholder`

## ARIA

- `aria-label="..."` -- provides an accessible name for the email input since it has no visible `<label>` element

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`) -- current email value, two-way bindable via `value`
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>`

## Acceptance Criteria

- [ ] Renders <input> element with class="email-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .email-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/email-input.html
- MDN `<input type="email">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
