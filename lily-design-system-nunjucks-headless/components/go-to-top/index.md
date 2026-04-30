# GoToTop

A link that returns users to the top of a long page.

## Canonical documentation

See [components/go-to-top/index.md](../../../components/go-to-top/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/go-to-top/macro.njk" import goToTop %}

{{ goToTop({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
