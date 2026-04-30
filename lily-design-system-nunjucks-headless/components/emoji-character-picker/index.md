# EmojiCharacterPicker

A picker for browsing and selecting emoji characters.

## Canonical documentation

See [components/emoji-character-picker/index.md](../../../components/emoji-character-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/emoji-character-picker/macro.njk" import emojiCharacterPicker %}

{{ emojiCharacterPicker({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
