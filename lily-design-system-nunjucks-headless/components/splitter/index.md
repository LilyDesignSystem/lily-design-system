# Splitter

A draggable divider for resizing adjacent panels.

## Canonical documentation

See [components/splitter/index.md](../../../components/splitter/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/splitter/macro.njk" import splitter %}

{{ splitter({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
