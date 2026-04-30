# DontList

A guideline list of discouraged dont-list-item components.

## Canonical documentation

See [components/dont-list/index.md](../../../components/dont-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/dont-list/macro.njk" import dontList %}

{{ dontList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
