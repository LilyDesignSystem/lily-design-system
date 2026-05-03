# InputWithMask

An input displaying a format mask placeholder for the user to fill in.

See `components/input-with-mask/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `input-with-mask`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<InputWithMask Label="...">
    Content
</InputWithMask>
```
