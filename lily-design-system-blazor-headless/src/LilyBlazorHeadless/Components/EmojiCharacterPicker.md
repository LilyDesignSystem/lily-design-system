# EmojiCharacterPicker

A picker for browsing and selecting emoji characters.

See `components/emoji-character-picker/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `emoji-character-picker`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EmojiCharacterPicker Label="...">
    Content
</EmojiCharacterPicker>
```
