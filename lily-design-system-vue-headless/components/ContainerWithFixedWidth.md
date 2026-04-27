# ContainerWithFixedWidth

A centered content wrapper that constrains its children to a configurable maximum width and centers them horizontally via `margin-inline: auto`. Renders a `<div class="container-with-fixed-width">` with a `data-max-width` attribute and inline `max-width` style.

## Implementation Notes

- Headless: only inline `max-width` and `margin-inline: auto` are applied (these implement the documented behavior)
- `data-max-width` exposes the configured value for consumer CSS hooks
- Pass-through attributes via `v-bind="$attrs"`

## Props

- `maxWidth`: string (default `"1200px"`) — CSS max-width value
- default slot — content to center
- `...$attrs` — additional HTML attributes

## Usage

```vue
<ContainerWithFixedWidth max-width="960px">
    <p>Page content</p>
</ContainerWithFixedWidth>

<ContainerWithFixedWidth max-width="65ch">
    <article>...</article>
</ContainerWithFixedWidth>
```

## Keyboard Interactions

- None — passive container.

## ARIA

- None — purely structural.

## When to Use

- Page content columns, dashboards, articles
- Any place where content should not stretch to the full viewport width

## When Not to Use

- Full-bleed sections (use `ContainerWithFluidWidth` instead)

## Headless

The component sets only `max-width` and `margin-inline: auto`. Consumers may add padding, background, or further constraints via the `container-with-fixed-width` class or the `data-max-width` attribute selector.

## Testing

- Verify root class
- Verify `data-max-width` defaults to `1200px` and accepts overrides
- Verify inline `max-width` style is applied
- Verify `margin-inline: auto` is applied

## References

- [MDN: max-width](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)
