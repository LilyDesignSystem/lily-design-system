# RomaniaPasaportView

A read-only display for Romania's Paşaport.

## Canonical documentation

See [components/romania-pasaport-view/index.md](../../../components/romania-pasaport-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/romania-pasaport-view/macro.njk" import romaniaPasaportView %}

{{ romaniaPasaportView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
