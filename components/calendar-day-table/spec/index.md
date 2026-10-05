# CalendarDayTable — Specification

Single source of truth for the CalendarDayTable component. A structural variant of `calendar-table` for a grid of the time slots of one day: one row per slot.

## Goal

A `<table role="grid">` wrapper, view-tagged with `data-view="day"`, that reuses the `CalendarTable*` sub-elements.

## HTML Tag and CSS Class

- HTML tag: <table>
- CSS class: .calendar-day-table

## Requirements

1. Root is `<table>` with first attribute `class="calendar-day-table {class}"`.
2. `role="grid"`.
3. `aria-label` is set from the required `label` prop.
4. `data-view="day"`.
5. `caption` renders a `<caption>` only when provided.
6. Children render inside the table; `restProps` spread onto the root.
7. No new sub-elements; no CSS; no hardcoded strings.

## Acceptance Criteria

- [x] Svelte canonical implemented with one test per requirement above
- [ ] Ported to the other headless libraries
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
