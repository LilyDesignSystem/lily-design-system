# SelectWithExtras

A select dropdown with additional features like search or groups.

See `components/select-with-extras/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `select-with-extras`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SelectWithExtras Label="...">
    Content
</SelectWithExtras>
```
