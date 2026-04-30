# EspanaTarjetaSanitariaIndividualView

A read-only display of an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier.

## Canonical documentation

See [components/espana-tarjeta-sanitaria-individual-view/index.md](../../../components/espana-tarjeta-sanitaria-individual-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/espana-tarjeta-sanitaria-individual-view/macro.njk" import espanaTarjetaSanitariaIndividualView %}

{{ espanaTarjetaSanitariaIndividualView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
