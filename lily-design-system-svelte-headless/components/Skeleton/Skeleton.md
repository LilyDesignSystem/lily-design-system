# Skeleton

A skeleton is a loading placeholder that indicates content is in the process of loading. It shows the approximate layout of content before it loads, reducing perceived loading time and preventing layout shift. The component uses `aria-hidden="true"` to hide the placeholder from screen readers and `aria-busy="true"` to signal that the region is being updated. The component is headless, allowing consumers to style the placeholder shapes with their own CSS.

## Implementation Notes

- Renders a `<div>` with `aria-hidden="true"` so screen readers completely skip the placeholder
- Uses `aria-busy="true"` to signal to assistive technology that the region is loading
- Accepts an optional `children` Snippet for placeholder shapes (e.g., lines, circles, rectangles)
- Spreads `restProps` for consumer customization (e.g., sizing, data attributes)

## Props

- `children`: Snippet (default: `undefined`) -- optional placeholder content (e.g., skeleton line shapes)
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```svelte
<Skeleton />
```

```svelte
<Skeleton>
  <div class="skeleton-line"></div>
</Skeleton>
```

## Keyboard Interactions

None -- this component is a passive placeholder hidden from interaction.

## ARIA

- `aria-hidden="true"` -- hides the placeholder entirely from screen readers
- `aria-busy="true"` -- signals that this region is in a loading state and content will be replaced

## References

- WAI-ARIA `aria-busy`: https://www.w3.org/WAI/ARIA/apd/states/aria-busy/
- MDN `aria-hidden`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden
