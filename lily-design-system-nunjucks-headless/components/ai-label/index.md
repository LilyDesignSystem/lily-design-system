# AiLabel

An indicator of AI instances that is a pathway to AI explainability.

## Canonical documentation

See [components/ai-label/index.md](../../../components/ai-label/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/ai-label/macro.njk" import aiLabel %}

{{ aiLabel({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
