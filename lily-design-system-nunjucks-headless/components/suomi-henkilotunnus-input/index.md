# SuomiHenkilotunnusInput

A input for Finland's Henkilötunnus.

## Canonical documentation

See [components/suomi-henkilotunnus-input/index.md](../../../components/suomi-henkilotunnus-input/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/suomi-henkilotunnus-input/macro.njk" import suomiHenkilotunnusInput %}

{{ suomiHenkilotunnusInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
