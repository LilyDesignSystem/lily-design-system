# Character

A character component displays a single character (glyph, symbol, emoji, or letter) with proper accessibility semantics. When the character conveys meaning (like a checkmark for success or a warning symbol), it uses `role="img"` with an `aria-label` so screen readers announce its purpose. When the character is purely decorative, the `decorative` prop hides it from assistive technologies.

This component is useful for initials, status indicators, rating symbols, decorative flourishes, and any place where a single glyph needs clear accessible context.

## Implementation Notes

- Renders as a `<span>` wrapper around the character content
- Uses `role="img"` with `aria-label` for meaningful characters so assistive technology announces the character's purpose
- Uses `role="presentation"` with `aria-hidden="true"` for decorative characters to hide from screen readers
- Uses Svelte 5 `Snippet` for children content
- Spreads `...restProps` on the root `<span>` element for consumer customization

## Props

- `label`: string (optional) -- accessible description of the character for screen readers
- `decorative`: boolean (default: false) -- when true, hides the character from assistive technology
- `children`: Snippet (required) -- the character to display

## Usage

```svelte
<Character label="Check mark">✓</Character>
<Character label="Warning symbol">⚠</Character>
<Character decorative>★</Character>
```

## Keyboard Interactions

None -- this component is a passive display element.

## ARIA

- `role="img"` -- applied when the character is meaningful (decorative is false), indicating the span represents an image-like glyph
- `role="presentation"` -- applied when `decorative` is true, removing semantic meaning
- `aria-label` -- provides the accessible name for meaningful characters; omitted when decorative
- `aria-hidden="true"` -- applied when `decorative` is true, hiding the element from the accessibility tree
