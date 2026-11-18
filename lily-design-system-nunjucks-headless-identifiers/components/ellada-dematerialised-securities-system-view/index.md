# ElladaDematerialisedSecuritiesSystemView

A read-only display for Greece's Dematerialised Securities System.

## Canonical documentation

See [components/ellada-dematerialised-securities-system-view/index.md](../../../components/ellada-dematerialised-securities-system-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/ellada-dematerialised-securities-system-view/macro.njk" import elladaDematerialisedSecuritiesSystemView %}

{{ elladaDematerialisedSecuritiesSystemView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
