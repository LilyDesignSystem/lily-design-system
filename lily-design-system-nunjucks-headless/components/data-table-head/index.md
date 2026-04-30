# DataTableHead

A data table interactive grid thead for displaying and sorting tabular data <thead>.

## Canonical documentation

See [components/data-table-head/index.md](../../../components/data-table-head/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/data-table-head/macro.njk" import dataTableHead %}

{{ dataTableHead({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
