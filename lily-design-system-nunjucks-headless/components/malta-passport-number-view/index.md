# MaltaPassportNumberView

A read-only display for Malta's Malta Passport Number.

## Canonical documentation

See [components/malta-passport-number-view/index.md](../../../components/malta-passport-number-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/malta-passport-number-view/macro.njk" import maltaPassportNumberView %}

{{ maltaPassportNumberView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
