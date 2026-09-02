# KanbanTableTH

a kanban board table interactive grid header cell for organizing items by status <th>

This is the Angular headless implementation. See `components/kanban-table-th/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<th>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<th>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<th lily-kanban-table-th></th>
```

## Files

- `KanbanTableTH.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `KanbanTableTH.spec.ts` — vitest + TestBed render test
