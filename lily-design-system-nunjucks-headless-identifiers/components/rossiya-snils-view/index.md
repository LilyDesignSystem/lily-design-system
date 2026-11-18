# RossiyaSnilsView

A read-only display for Russia's СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta).

## Canonical documentation

See [components/rossiya-snils-view/index.md](../../../components/rossiya-snils-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/rossiya-snils-view/macro.njk" import rossiyaSnilsView %}

{{ rossiyaSnilsView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
