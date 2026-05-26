# NederlandPaspoortNummerView

A read-only display for Netherlands's Paspoort Nummer.

## Canonical documentation

See [components/nederland-paspoort-nummer-view/index.md](../../../components/nederland-paspoort-nummer-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/nederland-paspoort-nummer-view/macro.njk" import nederlandPaspoortNummerView %}

{{ nederlandPaspoortNummerView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
