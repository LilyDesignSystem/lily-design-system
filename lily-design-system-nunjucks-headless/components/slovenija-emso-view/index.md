# SlovenijaEmsoView

A read-only display for Slovenia's Enotna Matična Številka Občana.

## Canonical documentation

See [components/slovenija-emso-view/index.md](../../../components/slovenija-emso-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/slovenija-emso-view/macro.njk" import slovenijaEmsoView %}

{{ slovenijaEmsoView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
