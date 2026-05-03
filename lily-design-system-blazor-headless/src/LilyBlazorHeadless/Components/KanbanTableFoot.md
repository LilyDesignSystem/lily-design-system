# KanbanTableFoot

A kanban board table interactive grid tfoot for organizing items by status <tfoot>.

See `components/kanban-table-foot/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `kanban-table-foot`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<KanbanTableFoot>
    Content
</KanbanTableFoot>
```
