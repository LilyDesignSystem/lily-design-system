# LatvijaPersonasKodsView

A read-only display for Latvia's Personas kods.

## Canonical documentation

See [components/latvija-personas-kods-view/index.md](../../../components/latvija-personas-kods-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/latvija-personas-kods-view/macro.njk" import latvijaPersonasKodsView %}

{{ latvijaPersonasKodsView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
