# PaginationLink

One pagination link in the trail.

## Canonical documentation

See [components/pagination-link/index.md](../../../components/pagination-link/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/pagination-link/macro.njk" import paginationLink %}

{{ paginationLink({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
