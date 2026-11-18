# EireIndividualHealthIdentifierView

A read-only display of Eire Individual Health Identifier (IHI) unique national healthcare identifier.

## Canonical documentation

See [components/eire-individual-health-identifier-view/index.md](../../../components/eire-individual-health-identifier-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/eire-individual-health-identifier-view/macro.njk" import eireIndividualHealthIdentifierView %}

{{ eireIndividualHealthIdentifierView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
