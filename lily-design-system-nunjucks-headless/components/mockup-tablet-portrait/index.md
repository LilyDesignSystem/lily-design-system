# MockupTabletPortrait

A box area that looks like a tablet computer in portrait mode.

## Canonical documentation

See [components/mockup-tablet-portrait/index.md](../../../components/mockup-tablet-portrait/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/mockup-tablet-portrait/macro.njk" import mockupTabletPortrait %}

{{ mockupTabletPortrait({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
