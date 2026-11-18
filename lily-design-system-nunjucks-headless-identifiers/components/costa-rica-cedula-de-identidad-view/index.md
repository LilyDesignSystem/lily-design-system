# CostaRicaCedulaDeIdentidadView

A read-only display for Costa Rica's Cédula de Identidad.

## Canonical documentation

See [components/costa-rica-cedula-de-identidad-view/index.md](../../../components/costa-rica-cedula-de-identidad-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/costa-rica-cedula-de-identidad-view/macro.njk" import costaRicaCedulaDeIdentidadView %}

{{ costaRicaCedulaDeIdentidadView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
