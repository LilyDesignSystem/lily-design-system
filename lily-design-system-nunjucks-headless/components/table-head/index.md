# TableHead

A table interactive grid thead <thead>.

## Canonical documentation

See [components/table-head/index.md](../../../components/table-head/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/table-head/macro.njk" import tableHead %}

{{ tableHead({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
