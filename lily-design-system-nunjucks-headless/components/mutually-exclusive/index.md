# MutuallyExclusive

A container ensuring only one option can be selected from a group.

## Canonical documentation

See [components/mutually-exclusive/index.md](../../../components/mutually-exclusive/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/mutually-exclusive/macro.njk" import mutuallyExclusive %}

{{ mutuallyExclusive({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
