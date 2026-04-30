# BackLink

A navigation link to return to a previous page.

## Canonical documentation

See [components/back-link/index.md](../../../components/back-link/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/back-link/macro.njk" import backLink %}

{{ backLink({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
