# TextInputWithSearch

A single-line text input field <input type="text"> with search capability.

See `components/text-input-with-search/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `text-input-with-search`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TextInputWithSearch Label="...">
    Content
</TextInputWithSearch>
```
