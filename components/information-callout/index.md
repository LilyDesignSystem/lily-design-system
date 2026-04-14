# Information Callout

InformationCallout is a headless component that highlights important information in a semantically distinct container. It renders an `<aside>` element with `role="note"` and an accessible label, making the callout content identifiable to assistive technologies as supplementary information.

This component is useful for displaying notices, tips, warnings, beta feature announcements, or any content that should stand out from the main flow. Consumers provide the callout content as children and bring their own styling to achieve the desired visual treatment.

## Implementation Notes

- Renders an `<aside>` element with `role="note"` for semantic supplementary content
- Uses `aria-label` to provide an accessible name describing the nature of the callout
- Accepts a `children` slot for flexible callout content
- Spreads `restProps` onto the aside for consumer customization
- pattern: standard props destructuring with typed props

## Props

- `label`: string (required) -- accessible name for the callout via `aria-label`
- `children`: slot (required) -- callout content to display
- `...restProps`: unknown -- additional attributes spread onto the `<aside>` element

## Usage

```html
<InformationCallout label="Note">
  <p>This feature is in beta. Your feedback helps us improve it.</p>
</InformationCallout>
```

```html
<InformationCallout label="Tip">
  <p>You can press <kbd>Ctrl</kbd> + <kbd>K</kbd> to open the command palette.</p>
</InformationCallout>
```

```html
<InformationCallout label="Important information">
  <h3>Processing times</h3>
  <p>Applications submitted after 5pm will be processed on the next working day.</p>
</InformationCallout>
```

## Keyboard Interactions

None -- this component is a passive container with no interactive behavior.

## ARIA

- `role="note"` -- identifies the content as a note or supplementary information
- `aria-label={label}` -- provides an accessible name describing the type of callout (e.g., "Note", "Warning", "Tip")

## When to Use

- Use to highlight informational content that supports the main page content, such as tips, notes, or supplementary guidance
- Use for beta feature announcements or new functionality notices
- Use when content is supplementary and should stand out visually from the main flow without conveying urgency
- Use for regulatory or policy information that users may find helpful but is not critical

## When Not to Use

- Do not use for warnings or critical safety information -- use WarningCallout instead
- Do not use for time-critical health information -- use CareCard with the appropriate urgency level
- Do not use for status messages that appear dynamically -- use Alert or Banner
- Do not use for form validation errors -- use ErrorMessage for individual fields or ErrorSummary for the form

## Headless

This headless component provides an `<aside>` with `role="note"` and `aria-label` for semantic supplementary content identification. The consumer provides all visual styling including background color, border, icon, and padding.


## Styles

The consumer provides all CSS styling. The component renders with a `.information-callout` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `information-callout`
- Verify role="note"` -- identifies the content as a note or supplementary information
- Verify aria-label={label}` -- provides an accessible name describing the type of callout (e.g., "Note", "Warning", "Tip")
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a distinct background color or left border to visually separate the callout from surrounding content. Include an informational icon (e.g., "i" circle) for quick recognition.
- **Developers**: Choose a descriptive `label` value (e.g., "Note", "Tip", "Important") so screen readers announce the callout type clearly.

## References

- WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
- HTML aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
