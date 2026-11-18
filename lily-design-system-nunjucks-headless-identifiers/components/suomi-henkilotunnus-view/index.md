# SuomiHenkilotunnusView

A read-only display for Finland's Henkilötunnus.

## Canonical documentation

See [components/suomi-henkilotunnus-view/index.md](../../../components/suomi-henkilotunnus-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/suomi-henkilotunnus-view/macro.njk" import suomiHenkilotunnusView %}

{{ suomiHenkilotunnusView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
