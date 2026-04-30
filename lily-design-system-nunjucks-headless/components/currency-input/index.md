# CurrencyInput

A locale-aware currency input with automatic formatting, symbols, separators.

## Canonical documentation

See [components/currency-input/index.md](../../../components/currency-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/currency-input/macro.njk" import currencyInput %}

{{ currencyInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
