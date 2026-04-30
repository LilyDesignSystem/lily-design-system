# DigitalObjectIdentifierLink

A permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source.

## Canonical documentation

See [components/digital-object-identifier-link/index.md](../../../components/digital-object-identifier-link/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/digital-object-identifier-link/macro.njk" import digitalObjectIdentifierLink %}

{{ digitalObjectIdentifierLink({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
