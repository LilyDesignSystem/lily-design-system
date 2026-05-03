# KanbanTable

A kanban board table interactive grid for organizing items by status <table>.

See `components/kanban-table/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `kanban-table`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<KanbanTable Label="...">
    Content
</KanbanTable>
```
