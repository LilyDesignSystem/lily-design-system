# MexicoClaveUnicaDeRegistroDePoblacionView

A read-only display for Mexico's Clave Única de Registro de Población (CURP).

## Canonical documentation

See [components/mexico-clave-unica-de-registro-de-poblacion-view/index.md](../../../components/mexico-clave-unica-de-registro-de-poblacion-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/mexico-clave-unica-de-registro-de-poblacion-view/macro.njk" import mexicoClaveUnicaDeRegistroDePoblacionView %}

{{ mexicoClaveUnicaDeRegistroDePoblacionView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
