# DateRange

A display of a start and end date range.

## Canonical documentation

See [components/date-range/index.md](../../../components/date-range/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/date-range/macro.njk" import dateRange %}

{{ dateRange({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
