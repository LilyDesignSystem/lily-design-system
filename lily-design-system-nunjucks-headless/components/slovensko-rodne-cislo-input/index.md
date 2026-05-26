# SlovenskoRodneCisloInput

A input for Slovakia's Rodné číslo.

## Canonical documentation

See [components/slovensko-rodne-cislo-input/index.md](../../../components/slovensko-rodne-cislo-input/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/slovensko-rodne-cislo-input/macro.njk" import slovenskoRodneCisloInput %}

{{ slovenskoRodneCisloInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
