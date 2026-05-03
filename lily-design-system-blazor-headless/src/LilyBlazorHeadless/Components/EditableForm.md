# EditableForm

A form wrapper for inline editing of content.

See `components/editable-form/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `editable-form`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EditableForm Label="...">
    Content
</EditableForm>
```
