# EmojiCharacterPicker

A picker for browsing and selecting emoji: a `<div role="group">` named by `label`, holding the consumer's emoji buttons. It is not a grid: `role="grid"` would promise arrow-key cell navigation the component does not provide.

See [components/emoji-character-picker/index.md](../../../../../components/emoji-character-picker/index.md) for the cross-framework documentation.

## Props

- `label` (string, required) - Accessible name, via `aria-label`.
- `children` (Snippet, required) - The emoji buttons, one per character, each with an `aria-label`.
- Other attributes spread onto the root.

## Keyboard

The buttons' own: Tab moves between them, Enter or Space chooses one.

## Usage

```html
<EmojiCharacterPicker label="Choose an emoji">
  <button
    type="button"
    aria-label="Grinning face"
  >
    😀
  </button>
  <button
    type="button"
    aria-label="Red heart"
  >
    ❤️
  </button>
</EmojiCharacterPicker>
```

---

Lily™ and Lily Design System™ are trademarks.
