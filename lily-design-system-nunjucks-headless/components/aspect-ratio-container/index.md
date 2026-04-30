# AspectRatioContainer

A container that maintains a fixed aspect ratio.

## Canonical documentation

See [components/aspect-ratio-container/index.md](../../../components/aspect-ratio-container/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/aspect-ratio-container/macro.njk" import aspectRatioContainer %}

{{ aspectRatioContainer({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
