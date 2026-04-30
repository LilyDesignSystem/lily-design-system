# MockupLaptop

A box area that looks like a laptop computer.

## Canonical documentation

See [components/mockup-laptop/index.md](../../../components/mockup-laptop/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/mockup-laptop/macro.njk" import mockupLaptop %}

{{ mockupLaptop({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
