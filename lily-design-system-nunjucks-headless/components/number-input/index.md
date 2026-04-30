# NumberInput

An input for entering a numeric value with validation <input type="number">.

## Canonical documentation

See [components/number-input/index.md](../../../components/number-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/number-input/macro.njk" import numberInput %}

{{ numberInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
