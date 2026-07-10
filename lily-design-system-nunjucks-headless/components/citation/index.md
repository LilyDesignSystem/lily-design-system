# Citation

A citation acknowledges the relevance of a work of another to the topic of discussion.

## Canonical documentation

See [components/citation/index.md](../../../components/citation/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/citation/macro.njk" import citation %}

{{ citation({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
