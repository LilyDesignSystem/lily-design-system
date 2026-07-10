# PolskaNumerIdentyfikacjiPodatkowejView

A read-only display for Poland's Numer Identyfikacji Podatkowej.

## Canonical documentation

See [components/polska-numer-identyfikacji-podatkowej-view/index.md](../../../components/polska-numer-identyfikacji-podatkowej-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/polska-numer-identyfikacji-podatkowej-view/macro.njk" import polskaNumerIdentyfikacjiPodatkowejView %}

{{ polskaNumerIdentyfikacjiPodatkowejView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
