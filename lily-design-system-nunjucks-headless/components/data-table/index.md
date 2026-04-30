# DataTable

A data table interactive grid for displaying and sorting tabular data <table>.

## Canonical documentation

See [components/data-table/index.md](../../../components/data-table/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/data-table/macro.njk" import dataTable %}

{{ dataTable({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
