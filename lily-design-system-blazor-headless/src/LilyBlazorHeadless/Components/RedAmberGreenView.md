# RedAmberGreenView

A read-only display of a red/amber/green status.

See `components/red-amber-green-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `red-amber-green-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<RedAmberGreenView Label="...">
    Content
</RedAmberGreenView>
```
