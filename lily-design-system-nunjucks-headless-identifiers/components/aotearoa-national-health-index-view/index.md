# AotearoaNationalHealthIndexView

A read-only display for New Zealand's National Health Index (NHI) Number.

## Canonical documentation

See [components/aotearoa-national-health-index-view/index.md](../../../components/aotearoa-national-health-index-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/aotearoa-national-health-index-view/macro.njk" import aotearoaNationalHealthIndexView %}

{{ aotearoaNationalHealthIndexView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
