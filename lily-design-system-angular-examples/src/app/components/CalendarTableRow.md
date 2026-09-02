# CalendarTableRow

a calendar table interactive grid row for managing dates, days, etc. <tr>

This is the Angular headless implementation. See `components/calendar-table-row/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tr>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tr>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tr lily-calendar-table-row></tr>
```

## Files

- `CalendarTableRow.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `CalendarTableRow.spec.ts` — vitest + TestBed render test
