# EmojiCharacterRadioGroup

A fieldset radio group for selecting an emoji character.

See `components/emoji-character-radio-group/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `emoji-character-radio-group`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EmojiCharacterRadioGroup Label="...">
    Content
</EmojiCharacterRadioGroup>
```
