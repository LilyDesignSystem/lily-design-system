# CalendarTableBody

a calendar table interactive grid tbody for managing dates, days, etc. <tbody>

This is the Angular headless implementation. See `components/calendar-table-body/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tbody>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tbody>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tbody lily-calendar-table-body></tbody>
```

## Files

- `CalendarTableBody.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `CalendarTableBody.spec.ts` — vitest + TestBed render test
