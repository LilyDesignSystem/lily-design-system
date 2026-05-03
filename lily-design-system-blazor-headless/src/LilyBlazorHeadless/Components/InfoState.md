# InfoState

A composition of illustration, title, description, and action for empty, error, or info states.

See `components/info-state/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `info-state`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<InfoState>
    Content
</InfoState>
```
