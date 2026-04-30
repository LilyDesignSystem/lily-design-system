# DataFilterForm

A form for filtering data by criteria.

## Canonical documentation

See [components/data-filter-form/index.md](../../../components/data-filter-form/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/data-filter-form/macro.njk" import dataFilterForm %}

{{ dataFilterForm({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
