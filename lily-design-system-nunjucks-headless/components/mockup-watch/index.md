# MockupWatch

A box area that looks like a smart watch.

## Canonical documentation

See [components/mockup-watch/index.md](../../../components/mockup-watch/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/mockup-watch/macro.njk" import mockupWatch %}

{{ mockupWatch({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
