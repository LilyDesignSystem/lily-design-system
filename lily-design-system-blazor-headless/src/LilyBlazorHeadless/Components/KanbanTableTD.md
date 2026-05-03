# KanbanTableTD

Kanban board table interactive grid data cell for organizing items by status <td>.

See `components/kanban-table-td/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `kanban-table-td`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<KanbanTableTD>
    Content
</KanbanTableTD>
```
