# Comment

A comment displays user discussions and user feedback.

## Canonical documentation

See [components/comment/index.md](../../../components/comment/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/comment/macro.njk" import comment %}

{{ comment({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
