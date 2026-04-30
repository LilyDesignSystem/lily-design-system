# Button

A generic clickable button element.

## Canonical documentation

See [components/button/index.md](../../../components/button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/button/macro.njk" import button %}

{{ button({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
