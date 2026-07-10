# TelLink

A tel hyperlink for a telephone number.

## Canonical documentation

See [components/tel-link/index.md](../../../components/tel-link/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tel-link/macro.njk" import telLink %}

{{ telLink({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
