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

- See `index.md` description: a horizontal progress indicator.

## When Not to Use

- See related components for alternative patterns.

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.

## Styles

The component renders with `.progress-bar` as the root class. No default styles are included.

## References

- Documentation: index.md
- CSS class: `.progress-bar` in css-style-sheet-template.css
