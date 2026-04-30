# Tooltip

A small popup showing descriptive text on hover or focus.

## Canonical documentation

See [components/tooltip/index.md](../../../components/tooltip/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tooltip/macro.njk" import tooltip %}

{{ tooltip({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
