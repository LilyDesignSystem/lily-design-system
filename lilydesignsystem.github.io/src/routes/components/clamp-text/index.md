# Clamp Text

A clamp text container truncates its inner content to a maximum number of
visible lines, exposing the line count as a data attribute and CSS custom
property so that consumer stylesheets can apply line-clamp without changing
the underlying DOM.

Use it when you need to constrain potentially long text such as product
descriptions, comments, or card summaries to a predictable height while
keeping the full content available to assistive technology.

## Implementation Notes

- Renders a `<div>` so block-level children can flow inside without breaking semantics
- Sets `data-lines={lines}` for CSS hooks and inline style `--clamp-text-lines: {lines}` for line-clamp
- Does not apply `overflow: hidden` or `-webkit-line-clamp` itself — the consumer chooses the clamping technique
- Full content remains in the DOM so screen readers can read the entire text even when visually truncated
- `aria-label` is optional and only applied when supplied

## Props

- `lines`: number (default: 2) -- maximum visible lines
- `label`: string (optional) -- aria-label for screen readers
- `children`: slot -- the text content to clamp
- `...restProps`: any additional HTML attributes

## Usage

Default two-line clamp:

```html
<ClampText>
  This is a long description that will be visually truncated to two lines
  while remaining fully present in the document for assistive technology.
</ClampText>
```

Three-line clamp with accessible label:

```html
<ClampText lines={3} label="Product description">
  A longer marketing block of text that should clamp to three lines.
</ClampText>
```

## Keyboard Interactions

- None -- this is a passive presentation container.

## ARIA

- `aria-label` is rendered only when the `label` prop is provided
- The full content remains accessible — text is not visually hidden, just clamped

## When to Use

- Use when text length is variable and you need a predictable visual height (cards, lists, tiles).
- Use when you want truncation to be a CSS responsibility instead of a DOM responsibility.
- Use when the full text must remain readable by screen readers.

## When Not to Use

- Do not use when the consumer needs an explicit "Show more" toggle -- use Collapsible or Expander instead.
- Do not use when truncation must be applied at the character level -- this component clamps by lines.

## Headless

This component renders only the structural `<div>` with the `clamp-text` class
plus a `data-lines` attribute and a `--clamp-text-lines` CSS custom property.
The consumer applies the actual line-clamp behavior (typically through
`-webkit-line-clamp` and `display: -webkit-box`, or modern `line-clamp`) using
the custom property.

## Styles

The consumer is responsible for the line-clamp CSS. A typical consumer style
hooks the `--clamp-text-lines` custom property:

```css
.clamp-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--clamp-text-lines);
  line-clamp: var(--clamp-text-lines);
  overflow: hidden;
}
```

## Testing

- Verify the component renders a `<div>` element with class `clamp-text`
- Verify `data-lines` matches the `lines` prop value
- Verify the inline style includes `--clamp-text-lines: {lines}`
- Verify `aria-label` is set when the `label` prop is provided
- Verify children content is rendered

## Advice

- **Designers**: Choose a line count that fits the worst-case content while preserving readability. Two or three lines is typical for cards.
- **Developers**: Do not add `overflow: hidden` to the headless component itself — apply it in your consumer CSS so the truncation strategy stays explicit.

## Related components

- `blockquote` — a block-level quotation with optional source citation

## References

- MDN line-clamp: https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp
- WCAG 1.4.4 Resize Text: https://www.w3.org/WAI/WCAG22/Understanding/resize-text
