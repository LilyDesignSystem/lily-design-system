# SectionList

A list of section navigation items.

## Canonical documentation

See [components/section-list/index.md](../../../components/section-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/section-list/macro.njk" import sectionList %}

{{ sectionList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
