# RedOrangeYellowGreenBluePicker

A picker for selecting a five-level color status.

## Canonical documentation

See [components/red-orange-yellow-green-blue-picker/index.md](../../../components/red-orange-yellow-green-blue-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/red-orange-yellow-green-blue-picker/macro.njk" import redOrangeYellowGreenBluePicker %}

{{ redOrangeYellowGreenBluePicker({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
