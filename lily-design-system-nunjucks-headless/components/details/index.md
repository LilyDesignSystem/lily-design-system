# Details

A disclosure widget that shows and hides content.

## Canonical documentation

See [components/details/index.md](../../../components/details/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/details/macro.njk" import details %}

{{ details({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
