# PaginationListItem

One pagination list item in the trail.

## Canonical documentation

See [components/pagination-list-item/index.md](../../../components/pagination-list-item/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/pagination-list-item/macro.njk" import paginationListItem %}

{{ paginationListItem({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
