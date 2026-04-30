# CalendarTableFoot

A calendar table interactive grid tfoot for managing dates, days, etc. <tfoot>.

## Canonical documentation

See [components/calendar-table-foot/index.md](../../../components/calendar-table-foot/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/calendar-table-foot/macro.njk" import calendarTableFoot %}

{{ calendarTableFoot({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
