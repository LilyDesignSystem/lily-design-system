# Timer

A timer is a UI/UX component that displays a countdown or elapsed time value
in a live-updating format. It renders as a semantic HTML `<time>` element with
`role="timer"`, which is not a live region: a value that changes every second
would flood a screen reader, so the reader hears it when they ask for it. The component is commonly used for
session timeouts, countdowns, stopwatches, cooking timers, exam time limits,
and any scenario where users need to track the passage of time. This headless
component provides the semantic structure and accessibility features while the
consumer manages the actual timer logic and provides formatted display content
through the children snippet.

## Implementation Notes

- Renders as `<time role="timer" aria-label={label}>`
- Children snippet provides the formatted timer display text
- Not a live region (`role="timer"` is `aria-live="off"`): announce milestones ("one minute left") in a separate `role="status"` region, never every tick
- Consumer manages timer logic (intervals, countdowns); this component only provides structure and accessibility
- Optional `datetime` attribute can be passed via restProps for machine-readable duration (e.g. `datetime="PT5M30S"`)

## Props

- `label`: string (required) -- accessible label for screen readers
- `children`: ReactNode (required) -- formatted timer display content
- `...restProps`: Any additional HTML attributes spread onto the `<time>` element

## Usage

```tsx
import Timer from "./Timer";

<Timer label="Countdown">05:30</Timer>;
```

With dynamic elapsed time:

```tsx
import Timer from "./Timer";

const [elapsed, setElapsed] = useState(0);
const formatted = useMemo(
  () =>
    `${Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0")}:${(elapsed % 60).toString().padStart(2, "0")}`,
  [elapsed],
);

useEffect(() => {
  const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
  return () => clearInterval(interval);
}, []);

<Timer label="Elapsed time">{formatted}</Timer>;
```

With machine-readable datetime attribute:

```tsx
<Timer
  label="Session timeout"
  datetime="PT5M30S"
>
  5:30
</Timer>
```

## Keyboard Interactions

- None -- this is an informational display, not interactive

## ARIA

- `role="timer"` indicates countdown or elapsed time
- `aria-label` from the label prop provides accessible name
- No `aria-live`: the timer is read on demand, and milestones go to a separate status region

## References

- WAI-ARIA timer role: https://www.w3.org/TR/wai-aria-1.2/#timer
- HTML `<time>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- ISO 8601 Duration format: https://en.wikipedia.org/wiki/ISO_8601#Durations
