# MagyarorszagTajSzamView

A read-only display for Hungary's Társadalombiztosítási Azonosító Jel (TAJ).

## Canonical documentation

See [components/magyarorszag-taj-szam-view/index.md](../../../components/magyarorszag-taj-szam-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/magyarorszag-taj-szam-view/macro.njk" import magyarorszagTajSzamView %}

{{ magyarorszagTajSzamView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
