# SuperBanner

A super-banner communicates a high-priority state that affects an entire app, experience, process, or system.

## Canonical documentation

See [components/super-banner/index.md](../../../components/super-banner/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/super-banner/macro.njk" import superBanner %}

{{ superBanner({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
