# Timer

## Overview

A headless timer that renders a semantic <time> element with role="timer"
and aria-live="polite" for accessible countdown or elapsed time displays.
The consumer manages the actual timer logic (intervals, countdowns) and
provides formatted display content through the children snippet. Commonly
used for session timeouts, countdowns, stopwatches, cooking timers, and
exam time limits.

## What it does

A countdown or elapsed time display.

## When to use

- Use when you need a countdown or elapsed time display.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Timer label="Countdown">05:30</Timer>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for screen readers via aria-label. |
| `children` | Snippet, required | Formatted timer display content. |
| `...restProps` | additional HTML attributes spread onto the <time> (e.g | datetime="PT5M30S"). |

## Examples

```svelte
<!-- Timer with machine-readable datetime attribute -->
<Timer label="Session timeout" datetime="PT5M30S">5:30</Timer>

<!-- Dynamic elapsed time -->
<Timer label="Elapsed time">{formatted}</Timer>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Timer from "$lib/components/Timer/Timer.svelte";
</script>

<Timer label="Countdown">05:30</Timer>
```

## Keyboard

- None -- informational display, not interactive

## Accessibility

- role="timer" indicates countdown or elapsed time
- aria-label provides the accessible name for screen readers
- aria-live="polite" announces timer updates without interrupting
- Semantic <time> element supports machine-readable time data

## Internationalization

- The label prop externalizes the accessible label string
- The children snippet allows localized time formatting

## References

- WAI-ARIA timer role: https://www.w3.org/TR/wai-aria-1.2/#timer
- HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- ISO 8601 Duration format: https://en.wikipedia.org/wiki/ISO_8601#Durations
