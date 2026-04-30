# BreadcrumbNav

A navigation container for breadcrumb trail links.

## Canonical documentation

See [components/breadcrumb-nav/index.md](../../../components/breadcrumb-nav/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/breadcrumb-nav/macro.njk" import breadcrumbNav %}

{{ breadcrumbNav({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
