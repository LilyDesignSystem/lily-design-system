# BeachBall

A beach ball is a loading/waiting indicator component, inspired by the colorful spinning cursor on macOS that appears when the system is busy. It provides a visual cue that a process is in progress and communicates to users that the system is working on a task.

This headless component renders a `<div>` with `role="status"` and `aria-live="polite"` for non-blocking screen reader announcements of loading state changes. The `active` prop controls whether the indicator is currently showing, and an inner `<span>` element serves as the animation target for consumer-applied CSS.

## Implementation Notes

- Renders as a `<div>` with `role="status"` and `aria-live="polite"` for non-blocking loading announcements
- `aria-busy` reflects the `active` prop, signaling to assistive technologies whether loading is in progress
- `data-active` attribute mirrors the active state for CSS state selectors (e.g., `[data-active="true"]`)
- Inner `<span aria-hidden="true">` is only rendered when active; consumers target it for spinning/animation CSS
- Uses Svelte 5 `$props()` for prop destructuring with rest props spread
- No hardcoded strings; all text comes through props for internationalization

## Props

- `label`: string (required) -- accessible description of what is loading, via `aria-label`
- `active`: boolean (default: `true`) -- whether the loading indicator is currently active
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Usage

```svelte
<BeachBall label="Loading content" />
```

```svelte
<BeachBall label="Processing request" active={isLoading} />
```

## Keyboard Interactions

- None -- this is a passive informational indicator, not interactive

## ARIA

- `role="status"` -- identifies this as a status region that announces updates to screen readers
- `aria-live="polite"` -- ensures loading announcements do not interrupt the user's current task
- `aria-busy` -- set to `true` when active, signaling to assistive technologies that content is loading
- `aria-label` -- provides the accessible name describing what is loading, set from the `label` prop

## References

- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
- ARIA aria-busy: https://www.w3.org/TR/wai-aria-1.2/#aria-busy
