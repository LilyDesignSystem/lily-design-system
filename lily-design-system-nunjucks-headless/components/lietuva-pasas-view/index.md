# LietuvaPasasView

A read-only display for Lithuania's Pasas.

## Canonical documentation

See [components/lietuva-pasas-view/index.md](../../../components/lietuva-pasas-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/lietuva-pasas-view/macro.njk" import lietuvaPasasView %}

{{ lietuvaPasasView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
