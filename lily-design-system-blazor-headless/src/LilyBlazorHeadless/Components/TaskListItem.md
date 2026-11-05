# TaskListItem

One task item with a checkbox and label.

See `components/task-list-item/index.md` for canonical documentation.

## Parameters

- `Label`: string (required)
- `Checked`, `CheckedChanged`: two-way with `@bind-Checked`, rendered as `data-checked`
- `Disabled`: bool, rendered as `data-disabled`
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<TaskListItem Label="Write the spec" @bind-Checked="done" />
```
