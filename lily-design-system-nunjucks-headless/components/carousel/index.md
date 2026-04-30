# Carousel

A slideshow for cycling through content items.

## Canonical documentation

See [components/carousel/index.md](../../../components/carousel/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/carousel/macro.njk" import carousel %}

{{ carousel({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
