# Field

A form field wrapper with label, input, and error message.

## Canonical documentation

See [components/field/index.md](../../../components/field/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/field/macro.njk" import field %}

{{ field({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
