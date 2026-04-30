# Header

A page or section header area.

## Canonical documentation

See [components/header/index.md](../../../components/header/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/header/macro.njk" import header %}

{{ header({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
