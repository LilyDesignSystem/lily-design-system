# Expander

An expander shows or hides additional content with a toggle button control. It is similar to a native `<details>`/`<summary>` disclosure element but uses a `<button>` trigger with `aria-expanded` for full control over behavior and presentation.

This component is useful for progressive disclosure patterns such as FAQ sections, collapsible panels, settings groups, or any interface where content should be hidden by default and revealed on demand. The expanded state is controlled, allowing parent components to programmatically control visibility.

## Implementation Notes

- Renders a `<div>` wrapper containing a `<button>` toggle and a conditional content region
- The button uses `aria-expanded` and `aria-controls` to communicate state to assistive technologies
- The content region uses `role="region"` with `aria-label` matching the button label
- A unique `contentId` is generated using `Math.random()` for the `aria-controls`/`id` link
- Supports controlled component usage for the `expanded` prop
- Content is conditionally rendered, removing it from the DOM when collapsed
- Uses `ReactNode` for the `children` prop

## Props

- `label`: string (required) -- button text and accessible name for both the button and the content region
- `expanded`: boolean (default: false) -- controlled boolean controlling whether the content is visible
- `children`: ReactNode (required) -- expandable content rendered when expanded is true
- `...restProps`: unknown -- additional attributes spread onto the outer `<div>` wrapper

## Usage

```tsx
<Expander label="Show details" expanded={isExpanded} onChange={setIsExpanded}>
  <p>Details here...</p>
</Expander>
```

```tsx
<Expander label="Advanced settings" expanded={showAdvanced} onChange={setShowAdvanced}>
  <form>...</form>
</Expander>
```

## Keyboard Interactions

- Enter: Toggles the expander open/closed when the button has focus (native button behavior)
- Space: Toggles the expander open/closed when the button has focus (native button behavior)
- Tab: Moves focus to/from the toggle button

## ARIA

- `aria-expanded={expanded}` -- on the button, indicates whether the controlled content is currently visible
- `aria-controls={contentId}` -- on the button, references the id of the expandable content region
- `role="region"` -- on the content container, identifies the expandable area as a landmark region
- `aria-label={label}` -- on the content region, provides an accessible name for the region

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
