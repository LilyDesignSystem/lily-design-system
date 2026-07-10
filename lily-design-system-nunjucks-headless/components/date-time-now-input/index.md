# DateTimeNowInput

An input for entering a date and time and "now" button <input type="date"><input type="time"><button type="button">.

## Canonical documentation

See [components/date-time-now-input/index.md](../../../components/date-time-now-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/date-time-now-input/macro.njk" import dateTimeNowInput %}

{{ dateTimeNowInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
