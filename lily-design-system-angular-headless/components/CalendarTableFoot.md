# CalendarTableFoot

a calendar table interactive grid tfoot for managing dates, days, etc. <tfoot>

This is the Angular headless implementation. See `components/calendar-table-foot/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tfoot>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tfoot>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tfoot lily-calendar-table-foot></tfoot>
```

## Files

- `CalendarTableFoot.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `CalendarTableFoot.spec.ts` — vitest + TestBed render test
