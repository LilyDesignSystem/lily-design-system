# BreadcrumbList

An ordered list of breadcrumb list items.

## Canonical documentation

See [components/breadcrumb-list/index.md](../../../components/breadcrumb-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/breadcrumb-list/macro.njk" import breadcrumbList %}

{{ breadcrumbList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
