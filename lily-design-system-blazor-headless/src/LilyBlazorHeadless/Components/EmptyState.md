# EmptyState

A placeholder shown when a list, table, or view has nothing to display yet, with room for guidance and an action.
Root `<div>`; when `Label` is given it becomes `role="group"` with `aria-label`. Not a live region. No icon; heading, text and action are consumer-supplied children.
See `components/empty-state/index.md`.

## Parameters

- `Label`: string? (optional)
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<EmptyState Label="No results"><h2>Nothing yet</h2><button type="button">Add one</button></EmptyState>
```
