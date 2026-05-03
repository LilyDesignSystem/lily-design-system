# GanttTable

A Gantt chart table interactive grid for planning schedule visualization <table>.

See `components/gantt-table/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `gantt-table`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<GanttTable Label="...">
    Content
</GanttTable>
```
