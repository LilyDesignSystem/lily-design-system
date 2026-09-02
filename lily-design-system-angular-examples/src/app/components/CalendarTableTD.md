# CalendarTableTD

a calendar table interactive grid data cell for managing dates, days, etc. <td>

This is the Angular headless implementation. See `components/calendar-table-td/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<td>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<td>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<td lily-calendar-table-td></td>
```

## Files

- `CalendarTableTD.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `CalendarTableTD.spec.ts` — vitest + TestBed render test
