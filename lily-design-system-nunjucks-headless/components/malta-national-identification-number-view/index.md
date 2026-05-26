# MaltaNationalIdentificationNumberView

A read-only display for Malta's Malta National Identification Number.

## Canonical documentation

See [components/malta-national-identification-number-view/index.md](../../../components/malta-national-identification-number-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/malta-national-identification-number-view/macro.njk" import maltaNationalIdentificationNumberView %}

{{ maltaNationalIdentificationNumberView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
