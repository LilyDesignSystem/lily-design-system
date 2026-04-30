# ProgressCircle

## Metadata

- Component: progress-circle
- PascalCase: ProgressCircle
- Description: a circular progress indicator
- HTML tag: <div>
- CSS class: .progress-circle
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="Progress"` and full ARIA value attributes
- Provides `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` to communicate progress to screen readers
- Accepts an optional `children` slot for content inside the circle (e.g., percentage text)
- Uses `aria-label` for accessible naming
- Spreads `restProps` for consumer customization

## ARIA

- `role="Progress"` -- identifies the element as a progress indicator
- `aria-label="..."` -- provides an accessible name for the progress indicator
- `aria-valuenow` -- the current progress value
- `aria-valuemin` -- the minimum value of the progress range
- `aria-valuemax` -- the maximum value of the progress range

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the progress indicator via `aria-label`
- `value`: number (default: `0`) -- current progress value
- `min`: number (default: `0`) -- minimum value of the progress range
- `max`: number (default: `100`) -- maximum value of the progress range
- `children`: slot (default: `undefined`) -- optional content rendered inside (e.g., percentage text)
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="progress-circle"
- [ ] Has aria-label attribute
- [ ] Has role="Progress"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .progress-circle in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/progress-circle.html
- WAI-ARIA Meter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/meter/
- MDN `role="Progress"`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Progress_role
