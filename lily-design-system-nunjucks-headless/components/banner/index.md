# Banner

A prominent message bar across the top of a page.

## Canonical documentation

See [components/banner/index.md](../../../components/banner/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/banner/macro.njk" import banner %}

{{ banner({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
