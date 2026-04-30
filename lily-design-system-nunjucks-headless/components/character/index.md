# Character

A single character display element.

## Canonical documentation

See [components/character/index.md](../../../components/character/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/character/macro.njk" import character %}

{{ character({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
