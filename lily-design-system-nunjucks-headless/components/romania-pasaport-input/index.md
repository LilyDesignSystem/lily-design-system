# RomaniaPasaportInput

A input for Romania's Paşaport.

## Canonical documentation

See [components/romania-pasaport-input/index.md](../../../components/romania-pasaport-input/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/romania-pasaport-input/macro.njk" import romaniaPasaportInput %}

{{ romaniaPasaportInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
