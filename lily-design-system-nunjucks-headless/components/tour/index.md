# Tour

A tour guide, such as for sightseeing, or pathways, or demonstrations, etc..

## Canonical documentation

See [components/tour/index.md](../../../components/tour/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tour/macro.njk" import tour %}

{{ tour({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
