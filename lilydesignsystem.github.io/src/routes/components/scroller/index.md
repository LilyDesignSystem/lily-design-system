# Scroller

A scrollytelling container with step-based foreground and background composition. The background content sticks in the viewport while foreground steps scroll over it, with the current step index driving background content changes.

This headless component uses a `<div>` element with an optional `aria-label` to create a scrollytelling region with separate background and foreground slots.

## Implementation Notes

- Uses `<div>` element with class `scroller`
- Background content sticks in viewport while foreground steps scroll over it
- Current step index drives background content changes
- Builds on ScrollerBase primitive internally
- Background uses position: sticky; foreground overlays with pointer-events: none on non-interactive areas
- Steps can contain any content (text, images, charts)

## Props

- `children`: slot (required) -- foreground step content
- `background`: slot (required) -- sticky background content that changes with steps
- `offset`: number (default: 0.5) -- viewport offset where step triggers
- `index`: number (bindable, default: 0) -- current active step index
- `progress`: number (bindable, default: 0) -- overall scroll progress (0-1)
- `label`: string (optional) -- accessible label for the scroller region
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Scroller label="Climate change data story" bind:index>
  <div slot="background">
    <!-- Changes based on index -->
    <img src="chart-{index}.png" alt="Chart showing step {index}" />
  </div>
  <div class="step">
    <p>In 2020, temperatures rose significantly.</p>
  </div>
  <div class="step">
    <p>By 2025, the trend accelerated.</p>
  </div>
</Scroller>
```

```html
<Scroller label="How a vaccine works" bind:index bind:progress>
  <div slot="background">
    <Animation frame={index} progress={progress} />
  </div>
  <div class="step">
    <p>The vaccine enters the body.</p>
  </div>
  <div class="step">
    <p>It triggers an immune response.</p>
  </div>
  <div class="step">
    <p>Antibodies are produced.</p>
  </div>
</Scroller>
```

## Keyboard Interactions

- Standard scroll behavior
- Tab navigates focusable content within steps

## ARIA

- `aria-label` on container when `label` prop is provided
- `aria-live="polite"` on background for screen reader updates when content changes

## Composition

- Uses ScrollerBase internally as the scroll-tracking primitive
- Background slot receives the current index and progress for content switching
- Foreground children are passed through to ScrollerBase as steps

## When to Use

- Use for data-driven storytelling where visuals change as the reader scrolls
- Use when presenting a narrative with a fixed visual that evolves alongside explanatory text
- Use for interactive articles, data journalism, and educational content

## When Not to Use

- Do not use for simple reveal animations -- use a simpler scroll-triggered approach
- Do not use when content does not benefit from scroll-driven narrative
- Do not use for video-driven stories -- use ScrollerVideo instead

## Headless

This component provides a `<div>` element with foreground/background composition and scroll tracking, with zero visual styling. The consumer is responsible for all CSS including background stickiness, foreground overlay positioning, step spacing, and responsive layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.scroller` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `scroller`
- Verify `aria-label` is applied when label prop is provided
- Verify background slot content is rendered
- Verify foreground step content is rendered
- Verify index updates as steps scroll into view
- Verify progress updates as the user scrolls
- Verify `aria-live="polite"` is on the background region
- Verify pass-through attributes are applied

## Advice

- **Designers**: Design background visuals that transition meaningfully between steps. Ensure foreground text has sufficient contrast against the background at every step. Consider reduced-motion preferences for animated backgrounds.
- **Developers**: Always provide a descriptive `label` prop for screen reader landmark navigation. Ensure background content updates are communicated via `aria-live`. Test with keyboard-only and screen reader navigation.

## Related components

- `scroller-base` — see components.tsv
- `scroller-video` — see components.tsv
- `horizontal-scroller` — see components.tsv
- `carousel` — a slideshow for cycling through content items

## References

- Reuters Graphics Scroller
- Scrollytelling best practices
- ScrollerBase component: ../scroller-base/index.md

---

Lily™ and Lily Design System™ are trademarks.
