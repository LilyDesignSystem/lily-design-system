# LuxembourgMatriculeView

A read-only display for Luxembourg's Numéro d'Identification Nationale (Matricule).

## Canonical documentation

See [components/luxembourg-matricule-view/index.md](../../../components/luxembourg-matricule-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/luxembourg-matricule-view/macro.njk" import luxembourgMatriculeView %}

{{ luxembourgMatriculeView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
