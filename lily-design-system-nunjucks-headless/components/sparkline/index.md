# Sparkline

A small inline chart showing a data trend.

## Canonical documentation

See [components/sparkline/index.md](../../../components/sparkline/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/sparkline/macro.njk" import sparkline %}

{{ sparkline({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
