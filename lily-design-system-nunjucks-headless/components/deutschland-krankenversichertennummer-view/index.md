# DeutschlandKrankenversichertennummerView

A read-only display for Germany's Krankenversichertennummer.

## Canonical documentation

See [components/deutschland-krankenversichertennummer-view/index.md](../../../components/deutschland-krankenversichertennummer-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/deutschland-krankenversichertennummer-view/macro.njk" import deutschlandKrankenversichertennummerView %}

{{ deutschlandKrankenversichertennummerView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
