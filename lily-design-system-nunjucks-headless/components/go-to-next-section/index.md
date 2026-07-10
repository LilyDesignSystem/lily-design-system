# GoToNextSection

A link that takes users to the next section of the current page.

## Canonical documentation

See [components/go-to-next-section/index.md](../../../components/go-to-next-section/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/go-to-next-section/macro.njk" import goToNextSection %}

{{ goToNextSection({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
