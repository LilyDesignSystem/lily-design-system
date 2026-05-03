# Autosuggest

A text input that proposes matching options as users type.

See `components/autosuggest/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `autosuggest`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Autosuggest Label="...">
    Content
</Autosuggest>
```
