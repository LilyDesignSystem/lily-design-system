# Expander

A control that expands to reveal more content.

## Canonical documentation

See [components/expander/index.md](../../../components/expander/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/expander/macro.njk" import expander %}

{{ expander({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
