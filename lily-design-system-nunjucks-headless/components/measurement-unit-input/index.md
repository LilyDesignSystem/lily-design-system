# MeasurementUnitInput

An input for selecting a measurement unit.

## Canonical documentation

See [components/measurement-unit-input/index.md](../../../components/measurement-unit-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/measurement-unit-input/macro.njk" import measurementUnitInput %}

{{ measurementUnitInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
