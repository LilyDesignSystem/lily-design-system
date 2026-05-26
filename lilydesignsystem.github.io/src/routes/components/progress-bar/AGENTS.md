# ProgressBar

## Metadata

- Component: progress-bar
- PascalCase: ProgressBar
- Description: a horizontal progress indicator
- HTML tag: <div>
- CSS class: .progress-bar
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="progressbar"` and ARIA value attributes
- Accepts `value`, `min`, and `max` props for the current and bounding values
- Sets `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label`
- Differs from `Progress` (which renders a native `<progress>` element) — `ProgressBar` is a div-based composition for cases where the native element does not provide enough styling control

## ARIA

- `role="progressbar"` identifies the element as a progress indicator
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` expose the current and bounding values
- `aria-label` provides an accessible name

## Keyboard

- No keyboard interactions — this is a passive status indicator

## Props

- `label`: string (required) — accessible name set on `aria-label`
- `value`: number (required) — current value
- `min`: number (default: 0) — minimum value
- `max`: number (default: 100) — maximum value
- `className`: string (optional) — extra CSS classes appended to `progress-bar`

## Acceptance Criteria

- [ ] Renders `<div>` element with class="progress-bar"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.progress-bar` in css-style-sheet-template.css
