# MeasurementSystemView

A read-only display of a measurement system.

## Canonical documentation

See [components/measurement-system-view/index.md](../../../components/measurement-system-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/measurement-system-view/macro.njk" import measurementSystemView %}

{{ measurementSystemView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
