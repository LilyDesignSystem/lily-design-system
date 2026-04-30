# CalendarRangePicker

A picker for selecting a date range on a calendar.

## Canonical documentation

See [components/calendar-range-picker/index.md](../../../components/calendar-range-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/calendar-range-picker/macro.njk" import calendarRangePicker %}

{{ calendarRangePicker({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
