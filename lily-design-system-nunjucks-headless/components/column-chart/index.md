# ColumnChart

A vertical column chart visualization for displaying data.

## Canonical documentation

See [components/column-chart/index.md](../../../components/column-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/column-chart/macro.njk" import columnChart %}

{{ columnChart({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
