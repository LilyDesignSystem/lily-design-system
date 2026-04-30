# SectionNav

A navigation container for section navigation links.

## Canonical documentation

See [components/section-nav/index.md](../../../components/section-nav/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/section-nav/macro.njk" import sectionNav %}

{{ sectionNav({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
