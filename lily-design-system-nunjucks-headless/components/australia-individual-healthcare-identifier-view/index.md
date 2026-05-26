# AustraliaIndividualHealthcareIdentifierView

A read-only display for Australia's Individual Healthcare Identifier.

## Canonical documentation

See [components/australia-individual-healthcare-identifier-view/index.md](../../../components/australia-individual-healthcare-identifier-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/australia-individual-healthcare-identifier-view/macro.njk" import australiaIndividualHealthcareIdentifierView %}

{{ australiaIndividualHealthcareIdentifierView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
