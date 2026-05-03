# CurrencyInput

A locale-aware currency input with automatic formatting, symbols, separators.

See `components/currency-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `currency-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CurrencyInput Label="...">
    Content
</CurrencyInput>
```
