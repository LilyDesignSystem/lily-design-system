# EestiIsikukoodInput

A input for Estonia's Isikukood.

## Canonical documentation

See [components/eesti-isikukood-input/index.md](../../../components/eesti-isikukood-input/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/eesti-isikukood-input/macro.njk" import eestiIsikukoodInput %}

{{ eestiIsikukoodInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
