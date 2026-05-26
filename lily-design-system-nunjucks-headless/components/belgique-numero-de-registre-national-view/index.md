# BelgiqueNumeroDeRegistreNationalView

A read-only display for Belgium's Numéro de Registre National / Rijksregisternummer.

## Canonical documentation

See [components/belgique-numero-de-registre-national-view/index.md](../../../components/belgique-numero-de-registre-national-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/belgique-numero-de-registre-national-view/macro.njk" import belgiqueNumeroDeRegistreNationalView %}

{{ belgiqueNumeroDeRegistreNationalView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
