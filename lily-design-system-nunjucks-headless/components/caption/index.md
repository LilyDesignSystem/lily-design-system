# Caption

A caption for a table or figure element.

## Canonical documentation

See [components/caption/index.md](../../../components/caption/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/caption/macro.njk" import caption %}

{{ caption({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
