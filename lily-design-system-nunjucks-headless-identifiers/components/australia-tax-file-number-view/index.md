# AustraliaTaxFileNumberView

A read-only display for Australia's Tax File Number (TFN).

## Canonical documentation

See [components/australia-tax-file-number-view/index.md](../../../components/australia-tax-file-number-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/australia-tax-file-number-view/macro.njk" import australiaTaxFileNumberView %}

{{ australiaTaxFileNumberView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
