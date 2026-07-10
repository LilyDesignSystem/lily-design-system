# PostalCodeView

A read-only display of a postal or ZIP code.

## Canonical documentation

See [components/postal-code-view/index.md](../../../components/postal-code-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/postal-code-view/macro.njk" import postalCodeView %}

{{ postalCodeView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
