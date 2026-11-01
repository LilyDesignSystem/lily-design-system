# CurrencyInput

A locale-aware currency input with automatic formatting, symbols, separators.

See `components/currency-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CurrencyCode`: string (required, no default) — ISO 4217 code, rendered as `data-currency-code`
- `CssClass`: string — extra CSS classes appended to `currency-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CurrencyInput Label="Amount" CurrencyCode="EUR" />
```
