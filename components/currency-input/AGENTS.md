# CurrencyInput

## Metadata

- Component: currency-input
- PascalCase: CurrencyInput
- Description: a locale-aware currency input with automatic formatting, symbols, separators
- HTML tag: <input>
- CSS class: .currency-input
- Interactive: no

## Key Behaviors

- Renders a native `<input>` element with `type="text"` and `inputmode="decimal"`
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Supports `min` and `max` value constraints
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization (e.g., `id`, `name`, `placeholder`)
- The `currencyCode` prop accepts ISO 4217 currency codes (e.g., "USD", "EUR", "GBP", "JPY")
- Formatting is handled by the consumer or by using the Intl.NumberFormat API
- pattern: `two-way binding` for the value prop

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the currency input
- `inputmode="decimal"` -- triggers a numeric keyboard with decimal point on mobile devices

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current numeric value; bindable with two-way binding
- `currencyCode`: string (default: `"USD"`) -- ISO 4217 currency code for formatting
- `min`: number (optional) -- minimum allowed value
- `max`: number (optional) -- maximum allowed value
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="currency-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .currency-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/currency-input.html
- HTML text input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
- Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
- ISO 4217 Currency Codes: https://www.iso.org/iso-4217-currency-codes.html
