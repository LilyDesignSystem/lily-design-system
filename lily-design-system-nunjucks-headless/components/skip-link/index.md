# SkipLink

A hidden link for keyboard users to skip to main content.

## Canonical documentation

See [components/skip-link/index.md](../../../components/skip-link/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/skip-link/macro.njk" import skipLink %}

{{ skipLink({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
