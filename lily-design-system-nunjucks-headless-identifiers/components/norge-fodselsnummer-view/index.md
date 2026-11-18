# NorgeFodselsnummerView

A read-only display for Norway's Fødselsnummer.

## Canonical documentation

See [components/norge-fodselsnummer-view/index.md](../../../components/norge-fodselsnummer-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/norge-fodselsnummer-view/macro.njk" import norgeFodselsnummerView %}

{{ norgeFodselsnummerView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
