# SverigePersonnummerInput

A input for Sweden's Personnummer.

## Canonical documentation

See [components/sverige-personnummer-input/index.md](../../../components/sverige-personnummer-input/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/sverige-personnummer-input/macro.njk" import sverigePersonnummerInput %}

{{ sverigePersonnummerInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
