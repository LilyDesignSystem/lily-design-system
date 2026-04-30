# NorthernIrelandHealthAndCareNumberInput

An input for entering aNorthern Ireland Health and Care (H&C) Number unique national healthcare identifier.

## Canonical documentation

See [components/northern-ireland-health-and-care-number-input/index.md](../../../components/northern-ireland-health-and-care-number-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/northern-ireland-health-and-care-number-input/macro.njk" import northernIrelandHealthAndCareNumberInput %}

{{ northernIrelandHealthAndCareNumberInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
