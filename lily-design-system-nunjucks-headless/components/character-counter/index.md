# CharacterCounter

A counter showing remaining or used characters in a text field.

## Canonical documentation

See [components/character-counter/index.md](../../../components/character-counter/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/character-counter/macro.njk" import characterCounter %}

{{ characterCounter({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
