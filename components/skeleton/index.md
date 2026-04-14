# Skeleton

A skeleton is a loading placeholder that indicates content is in the process of loading. It shows the approximate layout of content before it loads, reducing perceived loading time and preventing layout shift. The component uses `aria-hidden="true"` to hide the placeholder from screen readers and `aria-busy="true"` to signal that the region is being updated. The component is headless, allowing consumers to style the placeholder shapes with their own CSS.

## Implementation Notes

- Renders a `<div>` with `aria-hidden="true"` so screen readers completely skip the placeholder
- Uses `aria-busy="true"` to signal to assistive technology that the region is loading
- Accepts an optional `children` slot for placeholder shapes (e.g., lines, circles, rectangles)
- Spreads `restProps` for consumer customization (e.g., sizing, data attributes)

## Props

- `children`: slot (default: `undefined`) -- optional placeholder content (e.g., skeleton line shapes)
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

Card placeholder with text lines and avatar circle:

```html
<Skeleton>
  <div class="skeleton-circle" style="width: 48px; height: 48px;"></div>
  <div class="skeleton-line" style="width: 60%; height: 16px;"></div>
  <div class="skeleton-line" style="width: 80%; height: 16px;"></div>
</Skeleton>
```

Single-line text placeholder:

```html
<Skeleton>
  <div class="skeleton-line" style="width: 100%; height: 14px;"></div>
</Skeleton>
```

Image placeholder for a content card:

```html
<Skeleton>
  <div class="skeleton-rect" style="width: 100%; height: 200px;"></div>
  <div class="skeleton-line" style="width: 70%; height: 16px;"></div>
</Skeleton>
```

## Keyboard Interactions

None -- this component is a passive placeholder hidden from interaction.

## ARIA

- `aria-hidden="true"` -- hides the placeholder entirely from screen readers
- `aria-busy="true"` -- signals that this region is in a loading state and content will be replaced

## When to Use

- Use Skeleton as a placeholder while content is loading to show the approximate layout and reduce perceived wait time.
- Use Skeleton to prevent layout shift by reserving space for content that has not yet loaded.
- Use Skeleton for card-based layouts where each card can show placeholder shapes matching the expected text, image, and button positions.
- Use Skeleton when loading lists, tables, or profile views where the structure is known in advance.
- Use Skeleton for content-heavy pages where maintaining visual layout during loading improves perceived performance.

## When Not to Use

- Do not use Skeleton for error states -- show an error message instead using Alert or ErrorMessage.
- Do not use Skeleton for known-progress loading where a percentage is available -- use Progress instead.
- Do not use Skeleton for very fast operations (under 200ms) where a brief flash would be distracting.
- Do not use Skeleton when the content layout is unknown -- use ProgressSpinner or Loading instead.

## Headless

This headless component provides a `<div>` with `aria-hidden="true"` and `aria-busy="true"` to hide the placeholder from screen readers while signaling a loading state. The consumer provides all visual styling including placeholder shapes, shimmer animations, dimensions, and colors.


## Styles

The consumer provides all CSS styling. The component renders with a `.skeleton` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `skeleton`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Match skeleton shapes to the actual content layout (e.g., rectangles for text lines, circles for avatars). Use a subtle animation such as a shimmer or pulse to indicate loading.
- **Developers**: Replace the skeleton with actual content as soon as data loads, ensuring `aria-busy` is removed from the parent region. Avoid rendering skeletons for content that loads in under 200ms.

## References

- WAI-ARIA `aria-busy`: https://www.w3.org/WAI/ARIA/apd/states/aria-busy/
- MDN `aria-hidden`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden
