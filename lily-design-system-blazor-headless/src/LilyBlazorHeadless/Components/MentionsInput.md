# MentionsInput

A text input with at-mention autocomplete suggestions.

See `components/mentions-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `mentions-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MentionsInput Label="...">
    Content
</MentionsInput>
```
