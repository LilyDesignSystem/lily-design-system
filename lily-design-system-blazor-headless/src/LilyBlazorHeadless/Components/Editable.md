# Editable

An inline-editable text element that toggles between view and edit modes.

See `components/editable/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `editable`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Editable Label="...">
    Content
</Editable>
```
