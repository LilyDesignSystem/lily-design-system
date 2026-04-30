# Person

A person component that contains other person-related information.

## Canonical documentation

See [components/person/index.md](../../../components/person/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/person/macro.njk" import person %}

{{ person({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
