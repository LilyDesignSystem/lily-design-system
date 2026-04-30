# DateField

A structured field for entering date components.

## Canonical documentation

See [components/date-field/index.md](../../../components/date-field/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/date-field/macro.njk" import dateField %}

{{ dateField({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
