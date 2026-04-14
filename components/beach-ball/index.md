# Beach Ball

A beach ball is a loading/waiting indicator component, inspired by the colorful spinning cursor on macOS that appears when the system is busy. It provides a visual cue that a process is in progress and communicates to users that the system is working on a task.

This headless component renders a `<div>` with `role="status"` and `aria-live="polite"` for non-blocking screen reader announcements of loading state changes. The `active` prop controls whether the indicator is currently showing, and an inner `<span>` element serves as the animation target for consumer-applied CSS.

## Implementation Notes

- Renders as a `<div>` with `role="status"` and `aria-live="polite"` for non-blocking loading announcements
- `aria-busy` reflects the `active` prop, signaling to assistive technologies whether loading is in progress
- `data-active` attribute mirrors the active state for CSS state selectors (e.g., `[data-active="true"]`)
- Inner `<span aria-hidden="true">` is only rendered when active; consumers target it for spinning/animation CSS
- Uses props for prop destructuring with rest props spread
- No hardcoded strings; all text comes through props for internationalization

## Props

- `label`: string (required) -- accessible description of what is loading, via `aria-label`
- `active`: boolean (default: `true`) -- whether the loading indicator is currently active
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Usage

```html
<BeachBall label="Loading your dashboard" />
```

```html
<BeachBall label="Processing payment" active={isProcessing} />
```

```html
<!-- Conditional loading with a fallback message -->
<BeachBall label="Fetching search results" active={isSearching} />
{#if !isSearching}
  <p>Showing {results.length} results</p>
{/if}
```

## Keyboard Interactions

- None -- this is a passive informational indicator, not interactive

## ARIA

- `role="status"` -- identifies this as a status region that announces updates to screen readers
- `aria-live="polite"` -- ensures loading announcements do not interrupt the user's current task
- `aria-busy` -- set to `true` when active, signaling to assistive technologies that content is loading
- `aria-label` -- provides the accessible name describing what is loading, set from the `label` prop

## When to Use

- Use as a decorative animated loading indicator for playful or celebratory UI moments
- Use when you want a whimsical, macOS-inspired waiting indicator as an alternative to a standard spinner
- Use during page loads, data fetching, or background processing where the duration is indeterminate

## When Not to Use

- Do not use on clinical or transactional pages -- decorative animations are distracting in serious contexts
- Do not use for progress that has a known completion percentage -- use Progress or ProgressCircle instead
- Do not use when placeholder content is more appropriate -- use Skeleton for layout-matching loading states
- Do not use without a `prefers-reduced-motion` media query -- respect user motion preferences by pausing or hiding the animation

## Headless

This component provides `role="status"`, `aria-live="polite"`, `aria-busy`, and a `data-active` attribute with an inner `<span>` animation target, all with zero visual styling. The consumer is responsible for all CSS including the spinning animation, colors, size, and any backdrop or overlay effects.


## Styles

The consumer provides all CSS styling. The component renders with a `.beach-ball` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `beach-ball`
- Verify role="status"` -- identifies this as a status region that announces updates to screen readers
- Verify aria-label` -- provides the accessible name describing what is loading, set from the `label` prop
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep the indicator visually lightweight so it does not overwhelm the content area. Ensure the animation is smooth and not distracting at small sizes.
- **Developers**: Use the `active` prop to control visibility rather than mounting/unmounting the component, so the live region remains in the DOM for consistent screen reader announcements.

## References

- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
- ARIA aria-busy: https://www.w3.org/TR/wai-aria-1.2/#aria-busy
