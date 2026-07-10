# Autosuggest

A text input that proposes matching options as users type.

## Canonical documentation

See [components/autosuggest/index.md](../../../components/autosuggest/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/autosuggest/macro.njk" import autosuggest %}

{{ autosuggest({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
