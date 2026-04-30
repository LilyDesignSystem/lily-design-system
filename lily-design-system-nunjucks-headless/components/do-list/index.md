# DoList

A guideline list of encouraged do-list-item components.

## Canonical documentation

See [components/do-list/index.md](../../../components/do-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/do-list/macro.njk" import doList %}

{{ doList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
