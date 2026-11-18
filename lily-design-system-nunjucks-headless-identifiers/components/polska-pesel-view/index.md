# PolskaPeselView

A read-only display for Poland's PESEL.

## Canonical documentation

See [components/polska-pesel-view/index.md](../../../components/polska-pesel-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/polska-pesel-view/macro.njk" import polskaPeselView %}

{{ polskaPeselView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
