# SlovenskoRodneCisloView

A read-only display for Slovakia's Rodné číslo.

## Canonical documentation

See [components/slovensko-rodne-cislo-view/index.md](../../../components/slovensko-rodne-cislo-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/slovensko-rodne-cislo-view/macro.njk" import slovenskoRodneCisloView %}

{{ slovenskoRodneCisloView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
