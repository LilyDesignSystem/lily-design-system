# LineChart

A line chart visualization connecting data points to display data.

## Canonical documentation

See [components/line-chart/index.md](../../../components/line-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/line-chart/macro.njk" import lineChart %}

{{ lineChart({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
