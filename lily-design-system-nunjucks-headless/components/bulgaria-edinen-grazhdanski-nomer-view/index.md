# BulgariaEdinenGrazhdanskiNomerView

A read-only display for Bulgaria's Единен граждански номер / Edinen grazhdanski nomer.

## Canonical documentation

See [components/bulgaria-edinen-grazhdanski-nomer-view/index.md](../../../components/bulgaria-edinen-grazhdanski-nomer-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/bulgaria-edinen-grazhdanski-nomer-view/macro.njk" import bulgariaEdinenGrazhdanskiNomerView %}

{{ bulgariaEdinenGrazhdanskiNomerView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
