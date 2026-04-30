# SelectWithExtras

A select dropdown with additional features like search or groups.

## Canonical documentation

See [components/select-with-extras/index.md](../../../components/select-with-extras/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/select-with-extras/macro.njk" import selectWithExtras %}

{{ selectWithExtras({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
