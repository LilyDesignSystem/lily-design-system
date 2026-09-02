# GanttTableTr

a Gantt chart table interactive grid row for planning schedule visualization <tr>

This is the Angular headless implementation. See `components/gantt-table-tr/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tr>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tr>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tr lily-gantt-table-tr></tr>
```

## Files

- `GanttTableTr.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `GanttTableTr.spec.ts` — vitest + TestBed render test
