# KanbanTableTH

A kanban board table interactive grid header cell for organizing items by status <th>.

See `components/kanban-table-th/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `kanban-table-th`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<KanbanTableTH>
    Content
</KanbanTableTH>
```
