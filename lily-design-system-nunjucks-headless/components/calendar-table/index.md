# CalendarTable

A calendar table interactive grid for managing dates, days, etc. <table>.

## Canonical documentation

See [components/calendar-table/index.md](../../../components/calendar-table/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/calendar-table/macro.njk" import calendarTable %}

{{ calendarTable({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
