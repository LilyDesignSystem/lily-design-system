# Hint

Hint text providing guidance for a form field.

## Canonical documentation

See [components/hint/index.md](../../../components/hint/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/hint/macro.njk" import hint %}

{{ hint({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
