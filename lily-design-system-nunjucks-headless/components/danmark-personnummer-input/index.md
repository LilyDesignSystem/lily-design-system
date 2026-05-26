# DanmarkPersonnummerInput

A input for Denmark's Personnummer (CPR-nummer).

## Canonical documentation

See [components/danmark-personnummer-input/index.md](../../../components/danmark-personnummer-input/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/danmark-personnummer-input/macro.njk" import danmarkPersonnummerInput %}

{{ danmarkPersonnummerInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
