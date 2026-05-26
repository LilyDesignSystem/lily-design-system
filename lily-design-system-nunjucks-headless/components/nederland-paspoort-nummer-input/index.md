# NederlandPaspoortNummerInput

A input for Netherlands's Paspoort Nummer.

## Canonical documentation

See [components/nederland-paspoort-nummer-input/index.md](../../../components/nederland-paspoort-nummer-input/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/nederland-paspoort-nummer-input/macro.njk" import nederlandPaspoortNummerInput %}

{{ nederlandPaspoortNummerInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
