# Currency Input

CurrencyInput is a headless locale-aware text input for entering currency values with automatic formatting, currency symbols, thousand separators, and correct decimal places. It supports 40+ world currencies including USD, EUR, GBP, and JPY.

Use CurrencyInput for payment forms, price fields, budget inputs, and any form field that accepts monetary values. The component uses `inputmode="decimal"` for appropriate mobile keyboards and formats the display value while maintaining a clean numeric value for form submission.

## Implementation Notes

- Renders a native `<input>` element with `type="text"` and `inputmode="decimal"`
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Supports `min` and `max` value constraints
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization (e.g., `id`, `name`, `placeholder`)
- The `currencyCode` prop accepts ISO 4217 currency codes (e.g., "USD", "EUR", "GBP", "JPY")
- Formatting is handled by the consumer or by using the Intl.NumberFormat API
- pattern: `two-way binding` for the value prop

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current numeric value; bindable with two-way binding
- `currencyCode`: string (default: `"USD"`) -- ISO 4217 currency code for formatting
- `min`: number (optional) -- minimum allowed value
- `max`: number (optional) -- maximum allowed value
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

Basic USD price input:

```html
<CurrencyInput label="Price" value={amount} currencyCode="USD" />
```

EUR budget input with min/max constraints:

```html
<CurrencyInput label="Annual budget" value={budget} currencyCode="EUR" min={0} max={10000} />
```

JPY total input (no decimal places):

```html
<CurrencyInput label="Total" value={total} currencyCode="JPY" required />
```

Currency input in a payment form:

```html
<Form label="Payment details" onsubmit={handlePayment}>
  <Field label="Payment amount" required>
    <CurrencyInput label="Payment amount" value={paymentAmount} currencyCode="GBP" min={1} required />
  </Field>
  <Field label="Tip (optional)">
    <CurrencyInput label="Tip amount" value={tipAmount} currencyCode="GBP" min={0} />
  </Field>
  <Button type="submit">Pay now</Button>
</Form>
```

## Keyboard Interactions

None at the component level. Keyboard behavior is handled natively by the browser's text input implementation. Consumers may add increment/decrement via arrow keys if desired.

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the currency input
- `inputmode="decimal"` -- triggers a numeric keyboard with decimal point on mobile devices

## When to Use

- Use for form fields that accept monetary values, such as prices, budgets, payment amounts, or salary fields.
- Use when you need locale-aware currency formatting with proper symbols and separators.
- Use in checkout flows, invoicing forms, or financial dashboards where currency context matters.
- Use when the ISO 4217 currency code needs to be associated with the input value.

## When Not to Use

- Do not use for non-currency numbers -- use NumberInput instead.
- Do not use for displaying formatted amounts in read-only context -- format the text inline instead.
- Do not use for entering quantities or measurements -- use NumberInput or MeasurementInstanceInput instead.

## Headless

This headless component wraps a native `<input type="text">` with `inputmode="decimal"`, `aria-label` for accessible naming, two-way bindable value, and optional `min`, `max` constraints. The consumer provides all visual styling, including currency symbol display, input dimensions, borders, and validation error display. Formatting logic (thousand separators, decimal places, currency symbols) can be implemented by the consumer using Intl.NumberFormat or similar APIs.

## Styles

The consumer provides all CSS styling. The component renders with a `.currency-input` class for targeting. Common styling concerns include right-aligned text, currency symbol positioning (prefix or suffix), and `font-variant-numeric: tabular-nums` for consistent digit widths.

## Testing

- Verify the component renders an `<input>` element with `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `inputmode="decimal"` is present for mobile keyboard support
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied to the input

## Advice

- **Designers**: Display the currency symbol clearly near the input. Use right-aligned text and tabular numbers for consistent formatting. Show the expected currency format as placeholder text.
- **Developers**: Use `Intl.NumberFormat` with the appropriate locale and currency code for formatting display values. Be aware that different currencies have different decimal place requirements (e.g., JPY uses 0, USD uses 2). Validate and clamp values on blur rather than on every keystroke.

## References

- HTML text input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
- Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
- ISO 4217 Currency Codes: https://www.iso.org/iso-4217-currency-codes.html
