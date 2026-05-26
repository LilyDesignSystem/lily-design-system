# CeskoRodneCisloView

A read-only display for Czech Republic's Rodné číslo.

## Canonical documentation

See [components/cesko-rodne-cislo-view/index.md](../../../components/cesko-rodne-cislo-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/cesko-rodne-cislo-view/macro.njk" import ceskoRodneCisloView %}

{{ ceskoRodneCisloView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
