# CalendarTableTH

a calendar table interactive grid header cell for managing dates, days, etc. <th>

This is the Angular headless implementation. See `components/calendar-table-th/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<th>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<th>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<th lily-calendar-table-th></th>
```

## Files

- `CalendarTableTH.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `CalendarTableTH.spec.ts` — vitest + TestBed render test
