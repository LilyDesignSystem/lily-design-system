# Dialog

A modal or non-modal dialog window.

## Canonical documentation

See [components/dialog/index.md](../../../components/dialog/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/dialog/macro.njk" import dialog %}

{{ dialog({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
