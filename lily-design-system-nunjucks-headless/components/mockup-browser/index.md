# MockupBrowser

A box area that looks like a web browser.

## Canonical documentation

See [components/mockup-browser/index.md](../../../components/mockup-browser/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/mockup-browser/macro.njk" import mockupBrowser %}

{{ mockupBrowser({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
