# Input

A generic HTML input element.

## Canonical documentation

See [components/input/index.md](../../../components/input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/input/macro.njk" import input %}

{{ input({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
