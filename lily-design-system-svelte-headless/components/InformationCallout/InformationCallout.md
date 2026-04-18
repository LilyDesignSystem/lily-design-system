# InformationCallout

InformationCallout is a headless component that highlights important information in a semantically distinct container. It renders an `<aside>` element with `role="note"` and an accessible label, making the callout content identifiable to assistive technologies as supplementary information.

This component is useful for displaying notices, tips, warnings, beta feature announcements, or any content that should stand out from the main flow. Consumers provide the callout content as children and bring their own styling to achieve the desired visual treatment.

## Implementation Notes

- Renders an `<aside>` element with `role="note"` for semantic supplementary content
- Uses `aria-label` to provide an accessible name describing the nature of the callout
- Accepts a `children` Snippet for flexible callout content
- Spreads `restProps` onto the aside for consumer customization
- Svelte 5 pattern: standard `$props()` destructuring with typed props

## Props

- `label`: string (required) -- accessible name for the callout via `aria-label`
- `children`: Snippet (required) -- callout content to display
- `...restProps`: unknown -- additional attributes spread onto the `<aside>` element

## Usage

```svelte
<InformationCallout label="Note">
  <p>This feature is in beta.</p>
</InformationCallout>
```

## Keyboard Interactions

None -- this component is a passive container with no interactive behavior.

## ARIA

- `role="note"` -- identifies the content as a note or supplementary information
- `aria-label={label}` -- provides an accessible name describing the type of callout (e.g., "Note", "Warning", "Tip")

## References

- WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
- HTML aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
