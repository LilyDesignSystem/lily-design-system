# DataTableBody

A data table interactive grid tbody for displaying and sorting tabular data <tbody>.

## Canonical documentation

See [components/data-table-body/index.md](../../../components/data-table-body/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/data-table-body/macro.njk" import dataTableBody %}

{{ dataTableBody({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
