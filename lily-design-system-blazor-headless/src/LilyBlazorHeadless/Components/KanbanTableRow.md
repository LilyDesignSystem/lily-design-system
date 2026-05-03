# KanbanTableRow

A kanban board table interactive grid row for organizing items by status <tr>.

See `components/kanban-table-row/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `kanban-table-row`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<KanbanTableRow>
    Content
</KanbanTableRow>
```
