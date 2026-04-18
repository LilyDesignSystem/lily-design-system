# FloatingPanel

A floating panel is a container that overlays page content, typically used for tooltips, popovers, dropdown menus, or contextual UI. It renders conditionally based on an `open` prop, making it suitable for toggle-based visibility patterns. The component is headless, so consumers are responsible for positioning the panel relative to a trigger element using their own CSS.

## Implementation Notes

- Renders a `<div>` with `role="region"` only when the `open` prop is true
- Uses Svelte `{#if open}` block for conditional rendering (fully removed from DOM when closed)
- Accepts a `children` Snippet for panel content
- Provides `aria-label` for accessible naming of the panel region
- Spreads `restProps` for consumer customization (e.g., positioning attributes)

## Props

- `open`: boolean (default: `false`) -- whether the panel is visible
- `label`: string (required) -- accessible name for the panel region via `aria-label`
- `children`: Snippet (required) -- panel content to render inside
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```svelte
<FloatingPanel open={showPanel} label="Options">
  <p>Panel content</p>
</FloatingPanel>
```

## Keyboard Interactions

None -- this component is a passive container. Consumers should implement focus management and Escape-to-close behavior as needed for their use case.

## ARIA

- `role="region"` -- identifies the panel as a landmark region
- `aria-label="..."` -- provides an accessible name for the region

## References

- WAI-ARIA Practices - Disclosure Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/disclosure/
