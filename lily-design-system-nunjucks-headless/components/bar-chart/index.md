# BarChart

A horizontal bar chart visualization for displaying data.

## Canonical documentation

See [components/bar-chart/index.md](../../../components/bar-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/bar-chart/macro.njk" import barChart %}

{{ barChart({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
