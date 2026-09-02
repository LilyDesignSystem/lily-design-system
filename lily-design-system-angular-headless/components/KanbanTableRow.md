# KanbanTableRow

a kanban board table interactive grid row for organizing items by status <tr>

This is the Angular headless implementation. See `components/kanban-table-row/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tr>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tr>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tr lily-kanban-table-row></tr>
```

## Files

- `KanbanTableRow.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `KanbanTableRow.spec.ts` — vitest + TestBed render test
