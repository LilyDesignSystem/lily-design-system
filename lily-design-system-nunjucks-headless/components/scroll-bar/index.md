# ScrollBar

A custom scrollbar element.

## Canonical documentation

See [components/scroll-bar/index.md](../../../components/scroll-bar/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/scroll-bar/macro.njk" import scrollBar %}

{{ scrollBar({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
