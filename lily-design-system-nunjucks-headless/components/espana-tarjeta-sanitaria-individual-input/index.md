# EspanaTarjetaSanitariaIndividualInput

An input for entering an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier.

## Canonical documentation

See [components/espana-tarjeta-sanitaria-individual-input/index.md](../../../components/espana-tarjeta-sanitaria-individual-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/espana-tarjeta-sanitaria-individual-input/macro.njk" import espanaTarjetaSanitariaIndividualInput %}

{{ espanaTarjetaSanitariaIndividualInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
