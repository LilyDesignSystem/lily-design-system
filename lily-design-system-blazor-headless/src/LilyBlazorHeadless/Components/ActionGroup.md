# ActionGroup

A group of action buttons that can collapse to an overflow menu when space is constrained.

See `components/action-group/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `action-group`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ActionGroup Label="...">
    Content
</ActionGroup>
```
