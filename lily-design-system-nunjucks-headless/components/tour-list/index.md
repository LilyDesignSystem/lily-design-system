# TourList

An ordered list of tour guide steps.

## Canonical documentation

See [components/tour-list/index.md](../../../components/tour-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tour-list/macro.njk" import tourList %}

{{ tourList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
