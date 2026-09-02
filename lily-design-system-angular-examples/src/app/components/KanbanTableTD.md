# KanbanTableTD

kanban board table interactive grid data cell for organizing items by status <td>

This is the Angular headless implementation. See `components/kanban-table-td/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<td>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<td>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<td lily-kanban-table-td></td>
```

## Files

- `KanbanTableTD.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `KanbanTableTD.spec.ts` — vitest + TestBed render test
