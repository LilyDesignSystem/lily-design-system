# GanttTableTH

a Gantt chart table interactive grid header cell for planning schedule visualization <th>

This is the Angular headless implementation. See `components/gantt-table-th/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<th>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<th>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<th lily-gantt-table-th></th>
```

## Files

- `GanttTableTH.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `GanttTableTH.spec.ts` — vitest + TestBed render test
