# IslandKennitalaView

A read-only display for Iceland's Kennitala.

## Canonical documentation

See [components/island-kennitala-view/index.md](../../../components/island-kennitala-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/island-kennitala-view/macro.njk" import islandKennitalaView %}

{{ islandKennitalaView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
