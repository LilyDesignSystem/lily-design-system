# CalendarTableTH

A calendar table interactive grid header cell for managing dates, days, etc. <th>.

## Canonical documentation

See [components/calendar-table-th/index.md](../../../components/calendar-table-th/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/calendar-table-th/macro.njk" import calendarTableTh %}

{{ calendarTableTh({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
