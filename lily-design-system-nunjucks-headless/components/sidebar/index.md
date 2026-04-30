# Sidebar

A side panel for navigation or supplementary content.

## Canonical documentation

See [components/sidebar/index.md](../../../components/sidebar/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/sidebar/macro.njk" import sidebar %}

{{ sidebar({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
