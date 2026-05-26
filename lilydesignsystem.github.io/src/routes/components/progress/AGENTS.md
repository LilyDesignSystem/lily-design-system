# Progress

## Metadata

- Component: progress
- PascalCase: Progress
- Description: a horizontal progress bar showing completion
- HTML tag: <progress>
- CSS class: .progress
- Interactive: no

## Key Behaviors

- Renders a single `<progress>` element with no wrapper
- When `value` is undefined, the progress bar is indeterminate (the browser displays an animated or pulsing indicator)
- When `value` is a number, the progress bar shows determinate progress as a fraction of `max`
- Uses `aria-label` for accessible naming
- Spreads `restProps` onto the progress element for consumer extensibility

## ARIA

- `aria-label={label}` -- provides an accessible name describing what process the progress bar represents
- The `<progress>` element implicitly has `role="Progress"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes managed by the browser

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: number (default: undefined) -- current progress value; when undefined, the bar is indeterminate
- `max`: number (default: 100) -- maximum value representing 100% completion
- `...restProps`: unknown -- additional attributes spread onto the progress element

## Acceptance Criteria

- [ ] Renders <progress> element with class="progress"
- [ ] Has aria-label attribute
- [ ] Has role="Progress"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .progress in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/progress.html
- MDN progress element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress
- WAI-ARIA Progress role: https://www.w3.org/WAI/ARIA/apg/patterns/meter/
