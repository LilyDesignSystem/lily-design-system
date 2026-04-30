# AreaChart

An area chart visualization showing sized components in continuous data.

## Canonical documentation

See [components/area-chart/index.md](../../../components/area-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/area-chart/macro.njk" import areaChart %}

{{ areaChart({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
