# OsterreichSozialversicherungsnummerView

A read-only display for Austria's Sozialversicherungsnummer (SVNR).

## Canonical documentation

See [components/osterreich-sozialversicherungsnummer-view/index.md](../../../components/osterreich-sozialversicherungsnummer-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/osterreich-sozialversicherungsnummer-view/macro.njk" import osterreichSozialversicherungsnummerView %}

{{ osterreichSozialversicherungsnummerView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
