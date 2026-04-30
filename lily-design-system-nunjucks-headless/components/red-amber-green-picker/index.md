# RedAmberGreenPicker

A picker for selecting a red/amber/green status.

## Canonical documentation

See [components/red-amber-green-picker/index.md](../../../components/red-amber-green-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/red-amber-green-picker/macro.njk" import redAmberGreenPicker %}

{{ redAmberGreenPicker({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
