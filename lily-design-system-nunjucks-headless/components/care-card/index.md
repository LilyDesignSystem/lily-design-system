# CareCard

A medical care instruction card with urgency levels.

## Canonical documentation

See [components/care-card/index.md](../../../components/care-card/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/care-card/macro.njk" import careCard %}

{{ careCard({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
