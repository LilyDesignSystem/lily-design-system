# DataTableFoot

A data table interactive grid tfoot for displaying and sorting tabular data <tfoot>.

## Canonical documentation

See [components/data-table-foot/index.md](../../../components/data-table-foot/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/data-table-foot/macro.njk" import dataTableFoot %}

{{ dataTableFoot({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
