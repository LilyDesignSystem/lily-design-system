# ScrollerBase

A low-level scroll position tracking primitive for scrollytelling. ScrollerBase uses IntersectionObserver to track which step is currently active and exposes bindable index and progress values that consumers use to drive visual changes.

This headless component uses a `<div>` element with an `aria-label` to create a labeled scrollable region for scrollytelling content.

## Implementation Notes

- Uses `<div>` element with class `scroller-base`
- Tracks scroll position using IntersectionObserver
- Exposes current step index and overall progress as bindable values
- Steps are child elements; each child becomes a scrollytelling step
- Consumer uses index/progress to drive visual changes
- Offset controls where in the viewport a step triggers (0=top, 0.5=center, 1=bottom)

## Props

- `children`: slot (required) -- scrollable content
- `offset`: number (default: 0.5) -- viewport offset (0-1) where step triggers (0=top, 0.5=center, 1=bottom)
- `index`: number (bindable, default: 0) -- current active step index
- `progress`: number (bindable, default: 0) -- overall scroll progress (0-1)
- `...restProps`: Any additional HTML attributes

## Usage

```html
<ScrollerBase offset={0.5} bind:index bind:progress>
  <div class="step">Step 1 content</div>
  <div class="step">Step 2 content</div>
  <div class="step">Step 3 content</div>
</ScrollerBase>
```

```html
<ScrollerBase offset={0.3} bind:index>
  <div class="step">
    <h2>Introduction</h2>
    <p>The story begins here.</p>
  </div>
  <div class="step">
    <h2>Development</h2>
    <p>The plot thickens.</p>
  </div>
</ScrollerBase>
```

## Keyboard Interactions

- Standard scroll behavior
- Tab navigates between focusable step content

## ARIA

- `aria-label` for the scrollable region
- Steps should have appropriate roles as needed by the consumer

## When to Use

- Use as the foundation for custom scrollytelling implementations
- Use when you need fine-grained control over scroll-driven interactions
- Use when building a custom scrollytelling layout that does not fit the Scroller foreground/background pattern

## When Not to Use

- Do not use directly when you need the full scrollytelling experience with background/foreground composition -- use Scroller instead
- Do not use for simple scroll-triggered animations -- use IntersectionObserver directly or a simpler approach

## Headless

This component provides a `<div>` element with IntersectionObserver-based scroll tracking, with zero visual styling. The consumer is responsible for all CSS including step layout, spacing, scroll snap, and any visual indicators of the current step.

## Styles

The consumer provides all CSS styling. The component renders with a `.scroller-base` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `scroller-base`
- Verify `aria-label` is applied
- Verify child steps are rendered correctly
- Verify index updates as steps enter the viewport offset
- Verify progress updates as the user scrolls
- Verify pass-through attributes are applied

## Advice

- **Designers**: Plan step content with clear visual transitions in mind. Each step should represent a meaningful narrative beat. Consider how the viewport offset affects the reading experience.
- **Developers**: Always provide a descriptive `aria-label` for the scrollable region. Use the bindable `index` and `progress` values to drive visual changes in sibling or parent components. Choose an appropriate `offset` value based on content type -- 0.5 (center) works well for most cases.

## Related components

- `scroller` — see components.tsv
- `scroller-video` — see components.tsv
- `visible` — see components.tsv

## References

- Reuters Graphics ScrollerBase
- IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver

---

Lily™ and Lily Design System™ are trademarks.
