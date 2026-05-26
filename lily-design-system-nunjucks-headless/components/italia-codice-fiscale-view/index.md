# ItaliaCodiceFiscaleView

A read-only display for Italy's Codice fiscale.

## Canonical documentation

See [components/italia-codice-fiscale-view/index.md](../../../components/italia-codice-fiscale-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/italia-codice-fiscale-view/macro.njk" import italiaCodiceFiscaleView %}

{{ italiaCodiceFiscaleView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
