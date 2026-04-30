# RedAmberGreenView

A read-only display of a red/amber/green status.

## Canonical documentation

See [components/red-amber-green-view/index.md](../../../components/red-amber-green-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/red-amber-green-view/macro.njk" import redAmberGreenView %}

{{ redAmberGreenView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
