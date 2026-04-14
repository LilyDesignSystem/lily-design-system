# Character

A character component displays a single character (glyph, symbol, emoji, or letter) with proper accessibility semantics. When the character conveys meaning (like a checkmark for success or a warning symbol), it uses `role="img"` with an `aria-label` so screen readers announce its purpose. When the character is purely decorative, the `decorative` prop hides it from assistive technologies.

This component is useful for initials, status indicators, rating symbols, decorative flourishes, and any place where a single glyph needs clear accessible context.

## Implementation Notes

- Renders as a `<span>` wrapper around the character content
- Uses `role="img"` with `aria-label` for meaningful characters so assistive technology announces the character's purpose
- Uses `role="presentation"` with `aria-hidden="true"` for decorative characters to hide from screen readers
- Uses `slot` for children content
- Spreads `...restProps` on the root `<span>` element for consumer customization

## Props

- `label`: string (optional) -- accessible description of the character for screen readers
- `decorative`: boolean (default: false) -- when true, hides the character from assistive technology
- `children`: slot (required) -- the character to display

## Usage

Meaningful characters with accessible labels:

```html
<Character label="Check mark">✓</Character>
<Character label="Warning symbol">⚠</Character>
```

Decorative character hidden from assistive technology:

```html
<Character decorative>★</Character>
```

Status indicator in a task list:

```html
<ul>
  <li><Character label="Complete">✓</Character> Set up repository</li>
  <li><Character label="In progress">◐</Character> Write documentation</li>
  <li><Character label="Not started">○</Character> Add tests</li>
</ul>
```

Decorative drop cap at the start of a paragraph:

```html
<p>
  <Character decorative class="drop-cap">O</Character>nce upon a time, in a design system far, far away...
</p>
```

## Keyboard Interactions

None -- this component is a passive display element.

## ARIA

- `role="img"` -- applied when the character is meaningful (decorative is false), indicating the span represents an image-like glyph
- `role="presentation"` -- applied when `decorative` is true, removing semantic meaning
- `aria-label` -- provides the accessible name for meaningful characters; omitted when decorative
- `aria-hidden="true"` -- applied when `decorative` is true, hiding the element from the accessibility tree

## When to Use

- Use for displaying a single glyph, symbol, or character that needs accessible context, such as a checkmark for success or a warning symbol.
- Use for decorative symbols like stars or flourishes where you want to hide them from assistive technology.
- Use for status indicators represented by a single character, such as a bullet or arrow.
- Use for decorative initial caps or drop caps at the start of a paragraph.

## When Not to Use

- Do not use for emoji -- use Emoji with an accessible name instead.
- Do not use for icons -- use Icon instead.
- Do not use for multi-character text strings -- use a standard `<span>` or text element instead.

## Headless

This headless Character component provides the semantic `<span>` with conditional `role="img"` and `aria-label` for meaningful characters, or `role="presentation"` with `aria-hidden` for decorative ones. The consumer provides all visual styling including font size, color, spacing, and any decorative effects.


## Styles

The consumer provides all CSS styling. The component renders with a `.character` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `character`
- Verify role="img"` -- applied when the character is meaningful (decorative is false), indicating the span represents an image-like glyph
- Verify role="presentation"` -- applied when `decorative` is true, removing semantic meaning
- Verify aria-label` -- provides the accessible name for meaningful characters; omitted when decorative
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure meaningful characters have sufficient size and color contrast to be legible. Consider pairing symbols with supporting text for clarity.
- **Developers**: Always provide a descriptive `label` for meaningful characters. Set `decorative` to true for purely visual symbols that add no information.
