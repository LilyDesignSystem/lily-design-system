# ProgressBar

A horizontal progress indicator.

## Implementation Notes

- Renders a `<div>` with `role="progressbar"` and ARIA value attributes
- Accepts `value`, `min`, and `max` props for the current and bounding values
- Sets `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label`
- Differs from `Progress` (which renders a native `<progress>` element) — `ProgressBar` is a div-based composition for cases where the native element does not provide enough styling control

## Props

- `label`: string (required) — accessible name set on `aria-label`
- `value`: number (required) — current value
- `min`: number (default: 0) — minimum value
- `max`: number (default: 100) — maximum value
- `className`: string (optional) — extra CSS classes appended to `progress-bar`

## Usage

```html
<ProgressBar label="Upload progress" value={42} max={100} />
```

## Keyboard Interactions

- No keyboard interactions — this is a passive status indicator

## ARIA

- `role="progressbar"` identifies the element as a progress indicator
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` expose the current and bounding values
- `aria-label` provides an accessible name

## When to Use

- For determinate progress where the current value falls within a known range (file upload, form completion, multi-step task).
- When the consumer needs full control over the bar visualization (custom track, fill animation, segmented styles) — pick this over `Progress` whose native `<progress>` element is harder to style.
- When you need to expose progress state to assistive technology via ARIA value attributes.

## When Not to Use

- Do not use when progress is indeterminate (loading without a known endpoint) — use `ProgressSpinner` instead.
- Do not use as a circular indicator — use `ProgressCircle`.
- Do not use to display a measured value within a known range that is not progress (e.g. battery, disk usage) — use `Meter`.
- Do not use when the native `<progress>` element is sufficient — use `Progress` for less custom styling needs.

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.

## Styles

The component renders with `.progress-bar` as the root class. No default styles are included.

## Related components

- `progress` — a horizontal progress bar showing completion
- `progress-circle` — a circular progress indicator
- `progress-spinner` — an indeterminate spinning progress indicator
- `meter` — a gauge displaying a scalar value within a known range
- `loading` — a loading indicator, such as text, or image, or animation

## References

- Documentation: index.md
- CSS class: `.progress-bar` in css-style-sheet-template.css
