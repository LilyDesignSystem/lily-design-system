# CeskoRodneCisloInput

A input for Czech Republic's Rodné číslo.

## Canonical documentation

See [components/cesko-rodne-cislo-input/index.md](../../../components/cesko-rodne-cislo-input/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/cesko-rodne-cislo-input/macro.njk" import ceskoRodneCisloInput %}

{{ ceskoRodneCisloInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
