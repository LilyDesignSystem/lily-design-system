# Timer

A timer is a UI/UX component that displays a countdown or elapsed time value
in a live-updating format. It renders as a semantic HTML `<time>` element with
`role="timer"` and `aria-live="polite"` to ensure screen readers announce
updates without interrupting the user. The component is commonly used for
session timeouts, countdowns, stopwatches, cooking timers, exam time limits,
and any scenario where users need to track the passage of time. This headless
component provides the semantic structure and accessibility features while the
consumer manages the actual timer logic and provides formatted display content
through the children slot.

## Implementation Notes

- Renders as `<time role="timer" aria-label={label} aria-live="polite">`
- Children slot provides the formatted timer display text
- `aria-live="polite"` ensures screen readers announce updates without interrupting
- Consumer manages timer logic (intervals, countdowns); this component only provides structure and accessibility
- Optional `datetime` attribute can be passed via restProps for machine-readable duration (e.g. `datetime="PT5M30S"`)

## Props

- `label`: string (required) -- accessible label for screen readers
- `children`: slot (required) -- formatted timer display content
- `...restProps`: Any additional HTML attributes spread onto the `<time>` element

## Usage

```html
<Timer label="Session timeout" datetime="PT5M30S">05:30</Timer>
```

```html
<Timer label="Exam time remaining" datetime="PT45M00S">45:00</Timer>
```

```html
<Timer label="Elapsed consultation time">{formatMinutesSeconds(elapsed)}</Timer>
```

```html
<Timer label="Cooking timer" datetime="PT12M15S">12:15</Timer>
```

## Keyboard Interactions

- None -- this is an informational display, not interactive

## ARIA

- `role="timer"` indicates countdown or elapsed time
- `aria-label` from the label prop provides accessible name
- `aria-live="polite"` for non-intrusive screen reader announcements of updates

## When to Use

- Use for countdown or elapsed time display, such as session timeout, exam timer, or cooking timer.
- Use when screen readers need to be informed of time changes via a live region.
- Use with the `datetime` attribute for machine-readable ISO 8601 durations.
- Use when the displayed time updates dynamically via consumer-managed intervals.

## When Not to Use

- Do not use for static time display -- show the time as plain text or a `<time>` element.
- Do not use for auto-triggering actions on countdown -- use TimerButton instead.
- Do not use when time remaining is better shown as a proportion -- use Progress or Meter instead.

## Headless

This headless component provides a `<time>` element with `role="timer"`, `aria-label`, and `aria-live="polite"` for accessible live-updating time display. The consumer manages all timer logic (intervals, countdowns) and provides formatted display content through the children slot, plus all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.timer` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `timer`
- Verify role="timer"` indicates countdown or elapsed time
- Verify aria-label` from the label prop provides accessible name
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a clear, monospaced or tabular font for the timer digits to prevent layout shifts as numbers change. Consider color changes as time runs low.
- **Developers**: Provide a `datetime` attribute (e.g., `datetime="PT5M30S"`) via restProps for machine-readable duration. Manage cleanup of intervals on component unmount.

## References

- WAI-ARIA timer role: https://www.w3.org/TR/wai-aria-1.2/#timer
- HTML `<time>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- ISO 8601 Duration format: https://en.wikipedia.org/wiki/ISO_8601#Durations
