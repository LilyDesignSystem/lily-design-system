# Fieldset

A group of related form fields with a legend.

## Canonical documentation

See [components/fieldset/index.md](../../../components/fieldset/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/fieldset/macro.njk" import fieldset %}

{{ fieldset({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
