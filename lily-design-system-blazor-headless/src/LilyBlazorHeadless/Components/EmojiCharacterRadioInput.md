# EmojiCharacterRadioInput

A radio input for one choice of an emoji character <input type="radio">.

See `components/emoji-character-radio-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `emoji-character-radio-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EmojiCharacterRadioInput Label="...">
    Content
</EmojiCharacterRadioInput>
```
