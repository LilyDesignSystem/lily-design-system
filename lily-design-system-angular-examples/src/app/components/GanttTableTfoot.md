# GanttTableTfoot

a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>

This is the Angular headless implementation. See `components/gantt-table-tfoot/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tfoot>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tfoot>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tfoot lily-gantt-table-tfoot></tfoot>
```

## Files

- `GanttTableTfoot.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `GanttTableTfoot.spec.ts` — vitest + TestBed render test
