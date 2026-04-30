# ContentsNav

A contents navigation area.

## Canonical documentation

See [components/contents-nav/index.md](../../../components/contents-nav/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/contents-nav/macro.njk" import contentsNav %}

{{ contentsNav({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
