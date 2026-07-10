# ErrorMessage

An error message associated with a form field.

## Canonical documentation

See [components/error-message/index.md](../../../components/error-message/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/error-message/macro.njk" import errorMessage %}

{{ errorMessage({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
