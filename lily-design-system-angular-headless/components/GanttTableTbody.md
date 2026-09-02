# GanttTableTbody

a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>

This is the Angular headless implementation. See `components/gantt-table-tbody/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tbody>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tbody>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tbody lily-gantt-table-tbody></tbody>
```

## Files

- `GanttTableTbody.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `GanttTableTbody.spec.ts` — vitest + TestBed render test
