# EestiIsikukoodView

A read-only display for Estonia's Isikukood.

## Canonical documentation

See [components/eesti-isikukood-view/index.md](../../../components/eesti-isikukood-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/eesti-isikukood-view/macro.njk" import eestiIsikukoodView %}

{{ eestiIsikukoodView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
