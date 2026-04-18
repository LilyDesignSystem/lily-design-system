# EmojiCharacterPicker

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
- `children`: Snippet (required) -- the grid content containing emoji characters

## Usage

```svelte
<EmojiCharacterPicker label="Choose an emoji">
    <div role="row">
        <button role="gridcell">😀</button>
        <button role="gridcell">😂</button>
        <button role="gridcell">😍</button>
    </div>
</EmojiCharacterPicker>
```

## Keyboard Interactions

None built-in -- the consumer should implement grid keyboard navigation on cells (arrow keys for cell-to-cell movement, Enter/Space for selection).

## ARIA

- `role="grid"` -- identifies the container as a grid widget for structured cell navigation
- `aria-label={label}` -- provides an accessible name for the emoji picker

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
