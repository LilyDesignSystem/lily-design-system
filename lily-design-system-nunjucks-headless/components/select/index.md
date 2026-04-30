# Select

A dropdown select element for choosing one option.

## Canonical documentation

See [components/select/index.md](../../../components/select/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/select/macro.njk" import select %}

{{ select({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
