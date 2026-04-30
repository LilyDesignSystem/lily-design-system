# MeasurementInstanceView

A read-only display of a measurement value and unit.

## Canonical documentation

See [components/measurement-instance-view/index.md](../../../components/measurement-instance-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/measurement-instance-view/macro.njk" import measurementInstanceView %}

{{ measurementInstanceView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
