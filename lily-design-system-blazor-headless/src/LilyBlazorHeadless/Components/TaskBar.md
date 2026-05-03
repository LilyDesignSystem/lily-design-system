# TaskBar

A horizontal bar of task shortcuts or actions.

See `components/task-bar/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `task-bar`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TaskBar Label="...">
    Content
</TaskBar>
```
