# NihonKojinBangoView

A read-only display for Japan's Individual Number / My Number (マイナンバー).

## Canonical documentation

See [components/nihon-kojin-bango-view/index.md](../../../components/nihon-kojin-bango-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/nihon-kojin-bango-view/macro.njk" import nihonKojinBangoView %}

{{ nihonKojinBangoView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
