# CalendarTableHead

a calendar table interactive grid thead for managing dates, days, etc. <thead>

This is the Angular headless implementation. See `components/calendar-table-head/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<thead>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<thead>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<thead lily-calendar-table-head></thead>
```

## Files

- `CalendarTableHead.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `CalendarTableHead.spec.ts` — vitest + TestBed render test
