# IbanView

A read-only display for an International Bank Account Number (IBAN).

## Canonical documentation

See [components/iban-view/index.md](../../../components/iban-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/iban-view/macro.njk" import ibanView %}

{{ ibanView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
