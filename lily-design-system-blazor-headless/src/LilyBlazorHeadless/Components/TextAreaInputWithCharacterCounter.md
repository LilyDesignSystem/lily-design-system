# TextAreaInputWithCharacterCounter

A multi-line text area input with a caption below that is a character counter "[number] of [maximum] characters".

See `components/text-area-input-with-character-counter/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `text-area-input-with-character-counter`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TextAreaInputWithCharacterCounter Label="...">
    Content
</TextAreaInputWithCharacterCounter>
```
