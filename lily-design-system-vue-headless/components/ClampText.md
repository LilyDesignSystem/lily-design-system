# ClampText

A text container that truncates content to a maximum number of visible lines while keeping the full text in the DOM. The component renders a `<div class="clamp-text">` with a `data-lines` attribute and a `--clamp-text-lines` CSS custom property that consumers can use to drive `line-clamp` or `-webkit-line-clamp` CSS rules.

## Implementation Notes

- Headless: no CSS or styles applied beyond the `--clamp-text-lines` custom property
- Full text remains in the DOM; screen readers announce the entire content
- Visual truncation is delegated to consumer CSS (`-webkit-line-clamp`, `line-clamp`, `overflow: hidden`)
- `data-lines` attribute exposes the lines value as a CSS hook

## Props

- `lines`: number (default `2`) — maximum visible lines
- `label`: string (optional) — `aria-label` for screen readers
- default slot — text content to clamp
- `...$attrs` — additional HTML attributes spread onto the `<div>`

## Usage

```vue
<ClampText :lines="3">
    {{ summary }}
</ClampText>

<ClampText :lines="2" label="Product description">
    {{ description }}
</ClampText>
```

## Keyboard Interactions

- None — passive container.

## ARIA

- Optional `aria-label` for screen reader context.
- The full text remains accessible to assistive technology regardless of visual clamping.

## When to Use

- Card/list previews with consistent visual heights
- Article summaries, product descriptions, comment previews

## When Not to Use

- When all content must always be visible
- When the truncation should fully remove text from the DOM (use a different "show more / less" component)

## Headless

This component sets only the `--clamp-text-lines` CSS custom property and the `data-lines` attribute. Consumers must supply visual styling such as:

```css
.clamp-text {
    display: -webkit-box;
    -webkit-line-clamp: var(--clamp-text-lines);
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

## Testing

- Verify the root `clamp-text` class is present
- Verify `data-lines` defaults to `2` and accepts overrides
- Verify the `--clamp-text-lines` style is set
- Verify pass-through attributes

## References

- [MDN: line-clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp)
