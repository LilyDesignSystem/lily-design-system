# PaginationList

An ordered list of pagination list items.

## Canonical documentation

See [components/pagination-list/index.md](../../../components/pagination-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/pagination-list/macro.njk" import paginationList %}

{{ paginationList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
