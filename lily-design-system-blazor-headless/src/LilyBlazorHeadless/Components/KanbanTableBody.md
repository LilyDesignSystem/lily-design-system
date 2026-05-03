# KanbanTableBody

A kanban board table interactive grid tbody for organizing items by status <tbody>.

See `components/kanban-table-body/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `kanban-table-body`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<KanbanTableBody>
    Content
</KanbanTableBody>
```
