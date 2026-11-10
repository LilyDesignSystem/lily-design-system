# Timer

## Metadata

- Component: timer
- PascalCase: Timer
- Description: a countdown or elapsed time display
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <time>
- CSS class: .timer
- Interactive: no

## Key Behaviors

- Renders as `<time role="timer" aria-label={label}>`
- Children slot provides the formatted timer display text
- Not a live region (`role="timer"` is `aria-live="off"`): announce milestones ("one minute left") in a separate `role="status"` region, never every tick
- Consumer manages timer logic (intervals, countdowns); this component only provides structure and accessibility
- Optional `datetime` attribute can be passed via restProps for machine-readable duration (e.g. `datetime="PT5M30S"`)

## ARIA

- `role="timer"` indicates countdown or elapsed time
- `aria-label` from the label prop provides accessible name
- No `aria-live`: the timer is read on demand, and milestones go to a separate status region

## Keyboard

- None -- this is an informational display, not interactive

## Props

- `label`: string (required) -- accessible label for screen readers
- `children`: slot (required) -- formatted timer display content
- `...restProps`: Any additional HTML attributes spread onto the `<time>` element

## Acceptance Criteria

- [ ] Renders <time> element with class="timer"
- [ ] Has aria-label attribute
- [ ] Has role="timer"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .timer in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/timer.html
- WAI-ARIA timer role: https://www.w3.org/TR/wai-aria-1.2/#timer
- HTML `<time>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- ISO 8601 Duration format: https://en.wikipedia.org/wiki/ISO_8601#Durations
