# DanmarkPersonnummerView

A read-only display for Denmark's Personnummer (CPR-nummer).

## Canonical documentation

See [components/danmark-personnummer-view/index.md](../../../components/danmark-personnummer-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/danmark-personnummer-view/macro.njk" import danmarkPersonnummerView %}

{{ danmarkPersonnummerView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
