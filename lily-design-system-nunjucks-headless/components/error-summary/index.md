# ErrorSummary

A summary of all validation errors on a form.

## Canonical documentation

See [components/error-summary/index.md](../../../components/error-summary/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/error-summary/macro.njk" import errorSummary %}

{{ errorSummary({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
