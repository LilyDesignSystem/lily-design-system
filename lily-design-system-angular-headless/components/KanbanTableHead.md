# KanbanTableHead

a kanban board table interactive grid thead for organizing items by status <thead>

This is the Angular headless implementation. See `components/kanban-table-head/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<thead>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<thead>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<thead lily-kanban-table-head></thead>
```

## Files

- `KanbanTableHead.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `KanbanTableHead.spec.ts` — vitest + TestBed render test
