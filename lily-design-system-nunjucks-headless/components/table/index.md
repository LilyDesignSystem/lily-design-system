# Table

A table with rows and columns <table>.

## Canonical documentation

See [components/table/index.md](../../../components/table/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/table/macro.njk" import table %}

{{ table({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
