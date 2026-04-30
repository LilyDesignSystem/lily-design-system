# TableTD

A table interactive grid column <th>.

## Canonical documentation

See [components/table-th/index.md](../../../components/table-th/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/table-th/macro.njk" import tableTh %}

{{ tableTh({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
