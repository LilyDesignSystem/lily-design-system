# Timer

A timer is a UI/UX component that displays a countdown or elapsed time value
in a live-updating format. It renders as a semantic HTML `<time>` element with
`role="timer"`, which is not a live region: a value that changes every second
would flood a screen reader, so the reader hears it when they ask for it. The component is commonly used for
session timeouts, countdowns, stopwatches, cooking timers, exam time limits,
and any scenario where users need to track the passage of time. This headless
component provides the semantic structure and accessibility features while the
consumer manages the actual timer logic and provides formatted display content
through the children slot.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

## Implementation Notes

- Renders as `<time role="timer" aria-label={label}>`
- Children slot provides the formatted timer display text
- Not a live region (`role="timer"` is `aria-live="off"`): announce milestones ("one minute left") in a separate `role="status"` region, never every tick
- Consumer manages timer logic (intervals, countdowns); this component only provides structure and accessibility
- Optional `datetime` attribute can be passed via restProps for machine-readable duration (e.g. `datetime="PT5M30S"`)

## Props

- `label`: string (required) -- accessible label for screen readers
- `children`: slot (required) -- formatted timer display content
- `...restProps`: Any additional HTML attributes spread onto the `<time>` element

## Usage

```html
<Timer
  label="Session timeout"
  datetime="PT5M30S"
  >05:30</Timer
>
```

```html
<Timer
  label="Exam time remaining"
  datetime="PT45M00S"
  >45:00</Timer
>
```

```html
<Timer label="Elapsed consultation time">{formatMinutesSeconds(elapsed)}</Timer>
```

```html
<Timer
  label="Cooking timer"
  datetime="PT12M15S"
  >12:15</Timer
>
```

A reader who must hear the time hears a milestone, not every tick: the timer stays quiet, and a separate status region
announces the consumer's own words when a milestone passes.

```html
<Timer
  label="Session timeout"
  datetime="PT1M00S"
  >01:00</Timer
>
<p role="status">One minute left. Save your work.</p>
```

## Keyboard Interactions

- None -- this is an informational display, not interactive

## ARIA

- `role="timer"` indicates countdown or elapsed time
- `aria-label` from the label prop provides accessible name
- No `aria-live`: the timer is read on demand, and milestones go to a separate status region

## When to Use

- Use for countdown or elapsed time display, such as session timeout, exam timer, or cooking timer.
- Use with a separate `role="status"` region when a reader must hear a milestone, such as "one minute left".
- Use with the `datetime` attribute for machine-readable ISO 8601 durations.
- Use when the displayed time updates dynamically via consumer-managed intervals.

## When Not to Use

- Do not use for static time display -- show the time as plain text or a `<time>` element.
- Do not use for auto-triggering actions on countdown -- use TimerButton instead.
- Do not use when time remaining is better shown as a proportion -- use Progress or Meter instead.

## Headless

This headless component provides a `<time>` element with `role="timer"` and `aria-label`, not live, for an accessible time display. The consumer manages all timer logic (intervals, countdowns) and provides formatted display content through the children slot, plus all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.timer` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<time>` element with class `timer`
- Verify role="timer"` indicates countdown or elapsed time
- Verify aria-label` from the label prop provides accessible name
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a clear, monospaced or tabular font for the timer digits to prevent layout shifts as numbers change. Consider color changes as time runs low.
- **Accessibility**: Never make the timer itself live. Put milestone announcements ("five minutes left", "time is up") in a separate `role="status"` region (`role="alert"` only for the last one, if it ends the user's work), updated only when a milestone passes; WCAG 2.2.1 also asks that the user can extend a time limit.
- **Developers**: Provide a `datetime` attribute (e.g., `datetime="PT5M30S"`) via restProps for machine-readable duration. Manage cleanup of intervals on component unmount.

## Related components

- `timer-button` — a button with a timer that will automatically click after a given amount of time
- `loading` — a loading indicator, such as text, or image, or animation
- `date-time-view` — see components.tsv

## References

- WAI-ARIA timer role: https://www.w3.org/TR/wai-aria-1.2/#timer
- HTML `<time>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- ISO 8601 Duration format: https://en.wikipedia.org/wiki/ISO_8601#Durations

---

Lily™ and Lily Design System™ are trademarks.
