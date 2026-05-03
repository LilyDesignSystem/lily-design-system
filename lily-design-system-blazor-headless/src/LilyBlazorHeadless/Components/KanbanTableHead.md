# KanbanTableHead

A kanban board table interactive grid thead for organizing items by status <thead>.

See `components/kanban-table-head/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `kanban-table-head`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<KanbanTableHead>
    Content
</KanbanTableHead>
```
