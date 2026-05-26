# Timer

## Metadata

- Component: timer
- PascalCase: Timer
- Description: a countdown or elapsed time display
- HTML tag: <span>
- CSS class: .timer
- Interactive: no

## Key Behaviors

- Renders as `<time role="timer" aria-label={label} aria-live="polite">`
- Children slot provides the formatted timer display text
- `aria-live="polite"` ensures screen readers announce updates without interrupting
- Consumer manages timer logic (intervals, countdowns); this component only provides structure and accessibility
- Optional `datetime` attribute can be passed via restProps for machine-readable duration (e.g. `datetime="PT5M30S"`)

## ARIA

- `role="timer"` indicates countdown or elapsed time
- `aria-label` from the label prop provides accessible name
- `aria-live="polite"` for non-intrusive screen reader announcements of updates

## Keyboard

- None -- this is an informational display, not interactive

## Props

- `label`: string (required) -- accessible label for screen readers
- `children`: slot (required) -- formatted timer display content
- `...restProps`: Any additional HTML attributes spread onto the `<time>` element

## Acceptance Criteria

- [ ] Renders <span> element with class="timer"
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
