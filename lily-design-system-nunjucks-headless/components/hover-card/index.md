# HoverCard

A card that appears on hover over a trigger element.

## Canonical documentation

See [components/hover-card/index.md](../../../components/hover-card/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/hover-card/macro.njk" import hoverCard %}

{{ hoverCard({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
