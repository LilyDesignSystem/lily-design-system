# TimeoutDialog

A modal dialog warning users before session timeout.

## Canonical documentation

See [components/timeout-dialog/index.md](../../../components/timeout-dialog/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/timeout-dialog/macro.njk" import timeoutDialog %}

{{ timeoutDialog({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
