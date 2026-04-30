# Kbd

Show keyboard shortcuts and key combinations in a styled inline element.

## Canonical documentation

See [components/kbd/index.md](../../../components/kbd/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/kbd/macro.njk" import kbd %}

{{ kbd({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
