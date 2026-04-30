# Organization

An organization component that contains other organization-related information.

## Canonical documentation

See [components/organization/index.md](../../../components/organization/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/organization/macro.njk" import organization %}

{{ organization({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
