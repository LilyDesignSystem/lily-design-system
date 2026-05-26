# NederlandIdentiteitskaartNummerView

A read-only display for Netherlands's Identiteitskaart Nummer.

## Canonical documentation

See [components/nederland-identiteitskaart-nummer-view/index.md](../../../components/nederland-identiteitskaart-nummer-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/nederland-identiteitskaart-nummer-view/macro.njk" import nederlandIdentiteitskaartNummerView %}

{{ nederlandIdentiteitskaartNummerView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
