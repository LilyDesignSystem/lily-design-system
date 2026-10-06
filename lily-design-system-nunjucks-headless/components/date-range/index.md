# DateRange

Paired start and end date inputs in a `<fieldset>`.

## Canonical documentation

See [components/date-range/index.md](../../../components/date-range/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/date-range/macro.njk" import dateRange %}

{{ dateRange({ label: "Trip dates", startLabel: "Departure", endLabel: "Return", start: "2026-04-01" }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
