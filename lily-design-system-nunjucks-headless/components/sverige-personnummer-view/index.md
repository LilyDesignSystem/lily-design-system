# SverigePersonnummerView

A read-only display for Sweden's Personnummer.

## Canonical documentation

See [components/sverige-personnummer-view/index.md](../../../components/sverige-personnummer-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/sverige-personnummer-view/macro.njk" import sverigePersonnummerView %}

{{ sverigePersonnummerView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
