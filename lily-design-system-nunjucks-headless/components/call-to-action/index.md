# CallToAction

A prominent prompt encouraging user action.

## Canonical documentation

See [components/call-to-action/index.md](../../../components/call-to-action/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/call-to-action/macro.njk" import callToAction %}

{{ callToAction({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
