# Meter

A gauge displaying a scalar value within a known range.

## Canonical documentation

See [components/meter/index.md](../../../components/meter/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/meter/macro.njk" import meter %}

{{ meter({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
