# MockupTabletLandscape

A box area that looks like a tablet computer in landscape mode.

## Canonical documentation

See [components/mockup-tablet-landscape/index.md](../../../components/mockup-tablet-landscape/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/mockup-tablet-landscape/macro.njk" import mockupTabletLandscape %}

{{ mockupTabletLandscape({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
