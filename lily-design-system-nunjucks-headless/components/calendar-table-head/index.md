# CalendarTableHead

A calendar table interactive grid thead for managing dates, days, etc. <thead>.

## Canonical documentation

See [components/calendar-table-head/index.md](../../../components/calendar-table-head/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/calendar-table-head/macro.njk" import calendarTableHead %}

{{ calendarTableHead({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
