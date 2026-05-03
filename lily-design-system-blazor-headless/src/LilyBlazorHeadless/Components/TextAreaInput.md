# TextAreaInput

A multi-line text input area.

See `components/text-area-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `text-area-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TextAreaInput Label="...">
    Content
</TextAreaInput>
```
