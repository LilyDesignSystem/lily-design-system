# Progress

A progress bar visually indicates the completion status of a task or process using the native HTML `<progress>` element. It is commonly used for file uploads, form submissions, loading sequences, installation wizards, and any process where users benefit from knowing how much of a task has been completed.

The component supports both determinate progress (with a known value and maximum) and indeterminate progress (when the value is undefined, indicating an ongoing process of unknown duration). The native `<progress>` element provides built-in semantic meaning and accessibility support.

## Implementation Notes

- Renders a single `<progress>` element with no wrapper
- When `value` is undefined, the progress bar is indeterminate (the browser displays an animated or pulsing indicator)
- When `value` is a number, the progress bar shows determinate progress as a fraction of `max`
- Uses `aria-label` for accessible naming
- Spreads `restProps` onto the progress element for consumer extensibility

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: number (default: undefined) -- current progress value; when undefined, the bar is indeterminate
- `max`: number (default: 100) -- maximum value representing 100% completion
- `...restProps`: unknown -- additional attributes spread onto the progress element

## Usage

File upload with real-time percentage:

```html
<Progress label="Uploading report.pdf" value={73} max={100} />
```

Multi-step onboarding wizard:

```html
<Progress label="Onboarding progress" value={2} max={5} />
```

Indeterminate loading while fetching data:

```html
<Progress label="Loading patient records" />
```

Download progress with byte-based maximum:

```html
<Progress label="Downloading update" value={450} max={1024} />
```

## Keyboard Interactions

None -- this component is a passive display element that does not accept user input.

## ARIA

- `aria-label={label}` -- provides an accessible name describing what process the progress bar represents
- The `<progress>` element implicitly has `role="Progress"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes managed by the browser

## When to Use

- Use Progress to show a horizontal bar indicating file upload completion percentage.
- Use Progress for multi-step form or wizard progress, such as "Step 3 of 5".
- Use Progress to indicate download or installation progress with a known total size.
- Use Progress without a `value` prop for indeterminate loading states where duration is unknown.
- Use Progress for background processing tasks where the server reports a completion percentage.

## When Not to Use

- Do not use Progress for indeterminate loading when the duration is unknown and no percentage is available -- use ProgressSpinner instead.
- Do not use Progress for scalar gauges such as disk usage or battery level -- use Meter instead.
- Do not use Progress when a circular indicator better fits the layout, such as dashboard widgets -- use ProgressCircle instead.
- Do not use Progress for page-level loading overlays -- use Loading instead.

## Headless

The Progress headless component provides a native `<progress>` element with `aria-label` for accessible naming, supporting both determinate and indeterminate states. The browser provides built-in semantics including `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`. The consumer provides all visual styling for the progress bar appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.progress` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<progress>` element with class `progress`
- Verify aria-label={label}` -- provides an accessible name describing what process the progress bar represents
- Verify The `<progress>` element implicitly has `role="Progress"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes managed by the browser
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide a clear visual distinction between determinate (filled bar) and indeterminate (animated/pulsing) states, and ensure the progress bar has sufficient color contrast.
- **Developers**: Include a text fallback inside the `<progress>` element for older browsers, and update the `value` prop in real time during async operations to give users meaningful feedback.

## References

- MDN progress element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress
- WAI-ARIA Progress role: https://www.w3.org/WAI/ARIA/apd/patterns/meter/
