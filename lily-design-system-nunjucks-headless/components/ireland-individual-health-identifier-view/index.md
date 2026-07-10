# IrelandIndividualHealthIdentifierView

A read-only display of Ireland Individual Health Identifier (IHI) unique national healthcare identifier.

## Canonical documentation

See [components/ireland-individual-health-identifier-view/index.md](../../../components/ireland-individual-health-identifier-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/ireland-individual-health-identifier-view/macro.njk" import irelandIndividualHealthIdentifierView %}

{{ irelandIndividualHealthIdentifierView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
