# HorizontalScroller

A horizontally scrollable content container. HorizontalScroller provides a region that scrolls horizontally with overflow, supporting mouse drag scrolling, touch swipe, and keyboard navigation.

This headless component uses a `<div>` element with `role="region"` and `aria-label` to create an accessible horizontally scrollable area.

## Implementation Notes

- Uses `<div>` element with class `horizontal-scroller`
- Content scrolls horizontally with overflow
- Consumer styles children for horizontal layout (flexbox or grid)
- Supports mouse drag scrolling, touch swipe, and keyboard navigation
- Optional scroll snap behavior via consumer CSS
- `tabindex="0"` enables keyboard scrolling when the container is focused

## Props

- `label`: string (required) -- accessible label for the scrollable region
- `children`: slot (required) -- horizontally arranged content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<HorizontalScroller label="Photo gallery">
  <img src="photo1.jpg" alt="Photo 1" />
  <img src="photo2.jpg" alt="Photo 2" />
  <img src="photo3.jpg" alt="Photo 3" />
</HorizontalScroller>
```

```html
<HorizontalScroller label="Related articles">
  <Card>
    <h3>Article 1</h3>
    <p>Summary of article 1.</p>
  </Card>
  <Card>
    <h3>Article 2</h3>
    <p>Summary of article 2.</p>
  </Card>
  <Card>
    <h3>Article 3</h3>
    <p>Summary of article 3.</p>
  </Card>
</HorizontalScroller>
```

## Keyboard Interactions

- Left/Right arrow keys scroll horizontally when the container is focused
- Tab moves to focusable children within the scrollable area

## ARIA

- `role="region"` with `aria-label` for the scrollable area
- `aria-roledescription="carousel"` if applicable
- `tabindex="0"` for keyboard scrolling

## When to Use

- Use for horizontally scrolling galleries, card rows, or overflow content
- Use when content items are peers and benefit from a horizontal browsing experience
- Use when screen width cannot accommodate all items simultaneously

## When Not to Use

- Do not use for primary navigation -- use TabBar or NavigationMenu instead
- Do not use when all items should be visible -- use a grid layout instead
- Do not use for content that must be consumed in sequence -- use Scroller for scrollytelling

## Headless

This component provides a `<div>` element with `role="region"`, `aria-label`, `tabindex="0"`, and keyboard arrow key scrolling, with zero visual styling. The consumer is responsible for all CSS including horizontal layout (flexbox or grid), item sizing, scroll snap, scrollbar appearance, and responsive behavior.

## Styles

The consumer provides all CSS styling. The component renders with a `.horizontal-scroller` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `horizontal-scroller`
- Verify `role="region"` is applied
- Verify `aria-label` is applied
- Verify `tabindex="0"` is set for keyboard access
- Verify Left/Right arrow keys scroll the container horizontally when focused
- Verify child content is rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide visual cues that content extends beyond the visible area, such as partial visibility of the next item or scroll indicators. Consider how the layout adapts at different viewport widths.
- **Developers**: Always provide a descriptive `label` prop for screen reader users. Apply `overflow-x: auto` or `overflow-x: scroll` via CSS. Use `scroll-snap-type` for snap behavior. Test with keyboard, mouse drag, and touch swipe interactions.

## Related components

- `scroll-area` — a scrollable container with custom scrollbar support
- `carousel` — a slideshow for cycling through content items

## References

- Reuters Graphics HorizontalScroller
- WAI-ARIA carousel pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- CSS scroll snap: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap

---

Lily™ and Lily Design System™ are trademarks.
