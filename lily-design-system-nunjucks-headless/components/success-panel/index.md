# SuccessPanel

A panel confirming a task has been completed.

## Canonical documentation

See [components/success-panel/index.md](../../../components/success-panel/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/success-panel/macro.njk" import successPanel %}

{{ successPanel({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
