# GrailLayout

A responsive web design structure with header, left aside, center main, right aside, footer.

## Canonical documentation

See [components/grail-layout/index.md](../../../components/grail-layout/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/grail-layout/macro.njk" import grailLayout %}

{{ grailLayout({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
