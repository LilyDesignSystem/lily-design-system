# Progress Circle

A progress circle indicates completion status using a `<div>` with ARIA Progress semantics. Unlike a linear progress bar, the progress circle is intended to convey progress in a radial layout, commonly used for loading indicators, completion percentages, and dashboard widgets. The component is headless, so consumers provide their own CSS to create the circular visual representation using the ARIA value attributes.

## Implementation Notes

- Renders a `<div>` with `role="Progress"` and full ARIA value attributes
- Provides `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` to communicate progress to screen readers
- Accepts an optional `children` slot for content inside the circle (e.g., percentage text)
- Uses `aria-label` for accessible naming
- Spreads `restProps` for consumer customization

## Props

- `label`: string (required) -- accessible name for the progress indicator via `aria-label`
- `value`: number (default: `0`) -- current progress value
- `min`: number (default: `0`) -- minimum value of the progress range
- `max`: number (default: `100`) -- maximum value of the progress range
- `children`: slot (default: `undefined`) -- optional content rendered inside (e.g., percentage text)
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

Dashboard widget showing project completion:

```html
<ProgressCircle label="Project completion" value={75} max={100}>
  <span>75%</span>
</ProgressCircle>
```

Profile completion indicator:

```html
<ProgressCircle label="Profile completion" value={4} min={0} max={6}>
  <span>4 of 6</span>
</ProgressCircle>
```

File upload card with circular indicator:

```html
<ProgressCircle label="Uploading document" value={42}>
  <span>42%</span>
</ProgressCircle>
```

## Keyboard Interactions

None -- this component is a passive, read-only display.

## ARIA

- `role="Progress"` -- identifies the element as a progress indicator
- `aria-label="..."` -- provides an accessible name for the progress indicator
- `aria-valuenow` -- the current progress value
- `aria-valuemin` -- the minimum value of the progress range
- `aria-valuemax` -- the maximum value of the progress range

## When to Use

- Use ProgressCircle for compact progress displays in dashboards and widget cards where a radial indicator fits the layout.
- Use ProgressCircle when you want to show a percentage value inside the indicator via the children slot.
- Use ProgressCircle for upload or processing progress in space-constrained areas such as file cards or notification badges.
- Use ProgressCircle for profile completion indicators or skill ratings in user interfaces.

## When Not to Use

- Do not use ProgressCircle for indeterminate loading when no percentage is available -- use ProgressSpinner instead.
- Do not use ProgressCircle for standard linear progress bars such as form wizards or file downloads -- use Progress instead.
- Do not use ProgressCircle for static scalar measurements like disk usage or battery level -- use Meter instead.

## Headless

The ProgressCircle headless component provides a `<div>` with `role="progressbar"` and full ARIA value attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`) plus `aria-label` for accessible naming. The consumer provides all visual styling, including the circular SVG or CSS rendering and any inner content.


## Styles

The consumer provides all CSS styling. The component renders with a `.progress-circle` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `progress-circle`
- Verify role="Progress"` -- identifies the element as a progress indicator
- Verify aria-label="..."` -- provides an accessible name for the progress indicator
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a ring or arc visual with clear fill to indicate progress, and display the percentage value in the center of the circle for quick readability.
- **Developers**: Use the ARIA value attributes to drive your CSS or SVG arc calculations, keeping the visual and semantic states synchronized.

## References

- WAI-ARIA Meter Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/meter/
- MDN `role="Progress"`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Progress_role
