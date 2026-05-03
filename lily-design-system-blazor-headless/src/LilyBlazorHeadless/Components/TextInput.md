# TextInput

A single-line text input field <input type="text">.

See `components/text-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `text-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TextInput Label="...">
    Content
</TextInput>
```
