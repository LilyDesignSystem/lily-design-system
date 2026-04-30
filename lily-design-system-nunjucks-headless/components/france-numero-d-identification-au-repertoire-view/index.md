# FranceNumeroDIdentificationAuRepertoireView

A read-only display of a France numéro d'identification au répertoire (NIR) unique national healthcare identifier.

## Canonical documentation

See [components/france-numero-d-identification-au-repertoire-view/index.md](../../../components/france-numero-d-identification-au-repertoire-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/france-numero-d-identification-au-repertoire-view/macro.njk" import franceNumeroDIdentificationAuRepertoireView %}

{{ franceNumeroDIdentificationAuRepertoireView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
