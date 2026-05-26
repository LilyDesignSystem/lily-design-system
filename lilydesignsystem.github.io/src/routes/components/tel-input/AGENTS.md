# TelInput

## Metadata

- Component: tel-input
- PascalCase: TelInput
- Description: an input for entering a telephone number <input type="tel">
- HTML tag: <input>
- CSS class: .tel-input
- Interactive: no

## Companion

- tel-link

## Key Behaviors

- Renders as a single `<input type="tel">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can wrap with their own `<label>`)
- `autocomplete="tel"` enables browser and password manager autofill for phone numbers
- Bindable `value` prop uses two-way binding for two-way data binding
- Supports `required` and `disabled` HTML attributes natively
- Spreads `...restProps` onto the `<input>` for additional attributes like `placeholder`, `pattern`, `maxlength`, etc.

## ARIA

- `aria-label` -- provides the accessible name for the input, set from the `label` prop
- `autocomplete="tel"` -- signals browsers to offer telephone number autofill

## Keyboard

- Native `<input type="tel">` keyboard behavior applies (Tab to focus, type to enter digits)

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- bindable telephone number value
- `required`: boolean (default: `false`) -- whether the field is required for form submission
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any -- additional HTML attributes spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="tel-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tel-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tel-input.html
- HTML tel input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel
