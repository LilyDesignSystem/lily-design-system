# Emoji Character Picker

An emoji character picker is a component that presents a group of emoji characters for users to browse and select from. Commonly used in messaging applications, social media platforms, comment systems, and rich text editors, the emoji character picker provides an organized interface for inserting emoji into text, often organized by category such as smileys, animals, food, and symbols.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

This headless component renders a `<div>` with `role="group"` and an accessible label. The consumer provides the emoji buttons, selection logic, and category navigation as children.

## Implementation Notes

- Renders a `<div>` with `role="group"`, named by `label`
- Consumer provides the emoji as `<button>` elements, one per character
- Consumer implements selection behavior and category filtering
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state -- purely a structural wrapper
- Not a grid: `role="grid"` would promise arrow-key cell navigation the component does not provide (tasks.md P25-T20)

## Props

- `label`: string (required) -- accessible name describing the picker, applied via `aria-label`
- `children`: slot (required) -- the emoji buttons

## Usage

Emoji picker for a messaging interface, a named group of emoji buttons:

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
    aria-label="Face with tears of joy"
  >
    😂
  </button>
  <button
    type="button"
    aria-label="Red heart"
  >
    ❤️
  </button>
</EmojiCharacterPicker>
```

## Keyboard Interactions

- Tab: moves between the emoji buttons
- Enter or Space: chooses the focused emoji (native buttons)

## ARIA

- `role="group"` -- groups the emoji buttons under the picker's name
- `aria-label={label}` -- provides an accessible name for the emoji picker
- Each emoji button needs its own name, such as `aria-label="Grinning face"`, since a screen reader may read the character oddly or not at all

## When to Use

- Use for browsing and selecting emoji characters, such as in a messaging or reactions interface.
- Use in messaging apps, comment systems, or rich text editors.
- Use when a set of emoji organized by category provides a better experience than typing emoji names.

## When Not to Use

- Do not use for displaying a single emoji -- use Emoji instead.
- Do not use for non-emoji icon selection -- use a custom picker or Icon component.
- Do not use when a text-based emoji search input would be lighter and more appropriate for the interface.

## Headless

This headless component provides a `<div>` with `role="group"` and accessible labeling via `aria-label`. The consumer provides all visual styling (a CSS grid layout is fine: layout is not a role), the emoji buttons, category navigation and selection behavior.

## Styles

The consumer provides all CSS styling. The component renders with a `.emoji-character-picker` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `emoji-character-picker`
- Verify `role="group"` and `aria-label={label}`
- Verify the consumer's buttons render inside it
- Verify pass-through attributes are applied

## Advice

- **Designers**: Organize emoji into clearly labeled categories (e.g., smileys, animals, food). Provide a search or filter mechanism for quick access to specific emoji.
- **Developers**: Use real `<button>` elements with an `aria-label` naming each emoji. For a large set, group each category in its own labelled `emoji-character-picker`, so Tab is not a long walk.

## Related components

- `emoji` — a single emoji character with accessible name
- `character` — a single character display element

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
- Unicode CLDR emoji names (for the buttons' labels): https://cldr.unicode.org/translation/characters/short-names-and-keywords

---

Lily™ and Lily Design System™ are trademarks.
