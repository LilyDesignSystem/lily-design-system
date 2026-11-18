# PeruDocumentoNacionalDeIdentidadView

A read-only display for Peru's Documento Nacional de Identidad (DNI).

## Canonical documentation

See [components/peru-documento-nacional-de-identidad-view/index.md](../../../components/peru-documento-nacional-de-identidad-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/peru-documento-nacional-de-identidad-view/macro.njk" import peruDocumentoNacionalDeIdentidadView %}

{{ peruDocumentoNacionalDeIdentidadView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
