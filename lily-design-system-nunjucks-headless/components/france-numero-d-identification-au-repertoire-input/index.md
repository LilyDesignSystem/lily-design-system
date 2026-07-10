# FranceNumeroDIdentificationAuRepertoireInput

An input for entering a France numéro d'identification au répertoire (NIR) unique national healthcare identifier.

## Canonical documentation

See [components/france-numero-d-identification-au-repertoire-input/index.md](../../../components/france-numero-d-identification-au-repertoire-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/france-numero-d-identification-au-repertoire-input/macro.njk" import franceNumeroDIdentificationAuRepertoireInput %}

{{ franceNumeroDIdentificationAuRepertoireInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
