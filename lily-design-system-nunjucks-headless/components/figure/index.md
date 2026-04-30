# Figure

A self-contained figure with optional caption.

## Canonical documentation

See [components/figure/index.md](../../../components/figure/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/figure/macro.njk" import figure %}

{{ figure({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
