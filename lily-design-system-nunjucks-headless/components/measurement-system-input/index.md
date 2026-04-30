# MeasurementSystemInput

An input for selecting a measurement system.

## Canonical documentation

See [components/measurement-system-input/index.md](../../../components/measurement-system-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/measurement-system-input/macro.njk" import measurementSystemInput %}

{{ measurementSystemInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
