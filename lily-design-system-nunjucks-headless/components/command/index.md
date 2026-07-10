# Command

A command palette for searching and executing actions.

## Canonical documentation

See [components/command/index.md](../../../components/command/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/command/macro.njk" import command %}

{{ command({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
