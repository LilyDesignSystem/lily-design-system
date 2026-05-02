# CurrencyInput

A locale-aware currency input rendered as `<input type="text" inputmode="decimal">`. The component does not format the displayed value itself — formatting (Intl.NumberFormat, separators, currency symbol placement) is the consumer's responsibility because formatting rules vary by locale and design context.

## Props

- `className`: string (optional) -- CSS class appended to `currency-input`
- `label`: string (required) -- accessible name via `aria-label`
- `value`: number | undefined -- current numeric value (controlled)
- `onChange`: (value: number | undefined) => void -- fired when the parsed number changes; `undefined` when the input is empty
- `currencyCode`: string (default `"USD"`) -- ISO 4217 currency code, exposed as `data-currency-code` for consumer formatting
- `min`: number (optional) -- minimum allowed value
- `max`: number (optional) -- maximum allowed value
- `required`: boolean (default false) -- whether the input is required
- `disabled`: boolean (default false) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>`

## Usage

```tsx
const [amount, setAmount] = useState<number | undefined>(undefined);
return (
  <CurrencyInput
    label="Amount in USD"
    value={amount}
    onChange={setAmount}
    currencyCode="USD"
    min={0}
  />
);
```

## References

- HTML text input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
- Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
- ISO 4217 Currency Codes: https://www.iso.org/iso-4217-currency-codes.html
