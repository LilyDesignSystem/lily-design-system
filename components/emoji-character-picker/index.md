# Emoji Character Picker

An emoji character picker is a component that presents a grid of emoji characters for users to browse and select from. Commonly used in messaging applications, social media platforms, comment systems, and rich text editors, the emoji character picker provides an organized interface for inserting emoji into text, often organized by category such as smileys, animals, food, and symbols.

This headless component renders a `<div>` with `role="grid"` and an accessible label. The consumer provides the emoji grid content, selection logic, and category navigation as children.

## Implementation Notes

- Renders a `<div>` with `role="grid"` for structured grid navigation semantics
- Consumer provides grid rows and cells containing emoji characters
- Consumer implements selection behavior and category filtering
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state -- purely a structural wrapper

## Props

- `label`: string (required) -- accessible name describing the picker, applied via `aria-label`
- `children`: slot (required) -- the grid content containing emoji characters

## Usage

Emoji picker for a messaging interface:

```html
<EmojiCharacterPicker label="Choose an emoji">
    <div role="row" aria-label="Smileys">
        <button role="gridcell" aria-label="Grinning face">😀</button>
        <button role="gridcell" aria-label="Face with tears of joy">😂</button>
        <button role="gridcell" aria-label="Smiling face with heart-eyes">😍</button>
    </div>
    <div role="row" aria-label="Gestures">
        <button role="gridcell" aria-label="Thumbs up">👍</button>
        <button role="gridcell" aria-label="Clapping hands">👏</button>
        <button role="gridcell" aria-label="Waving hand">👋</button>
    </div>
</EmojiCharacterPicker>
```

## Keyboard Interactions

None built-in -- the consumer should implement grid keyboard navigation on cells (arrow keys for cell-to-cell movement, Enter/Space for selection).

## ARIA

- `role="grid"` -- identifies the container as a grid widget for structured cell navigation
- `aria-label={label}` -- provides an accessible name for the emoji picker

## When to Use

- Use for browsing and selecting emoji characters, such as in a messaging or reactions interface.
- Use in messaging apps, comment systems, or rich text editors.
- Use when a structured grid of emoji organized by category provides a better experience than typing emoji names.

## When Not to Use

- Do not use for displaying a single emoji -- use Emoji instead.
- Do not use for non-emoji icon selection -- use a custom picker or Icon component.
- Do not use when a text-based emoji search input would be lighter and more appropriate for the interface.

## Headless

This headless component provides a `<div>` with `role="grid"` and accessible labeling via `aria-label`, defining the semantic structure for emoji grid navigation. The consumer provides all visual styling, emoji grid content, category navigation, selection behavior, and keyboard navigation on cells.


## Styles

The consumer provides all CSS styling. The component renders with a `.emoji-character-picker` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `emoji-character-picker`
- Verify role="grid"` -- identifies the container as a grid widget for structured cell navigation
- Verify aria-label={label}` -- provides an accessible name for the emoji picker
- Verify pass-through attributes are applied

## Advice

- **Designers**: Organize emoji into clearly labeled categories (e.g., smileys, animals, food). Provide a search or filter mechanism for quick access to specific emoji.
- **Developers**: Implement arrow key navigation on `role="gridcell"` elements for keyboard accessibility. Use Enter or Space for emoji selection and ensure focus management within the grid.

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
