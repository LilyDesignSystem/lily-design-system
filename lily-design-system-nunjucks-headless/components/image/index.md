# Image

An image element with alt text.

## Canonical documentation

See [components/image/index.md](../../../components/image/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/image/macro.njk" import image %}

{{ image({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
