# Split View

A split view is a two-panel resizable layout container with a draggable
divider between the panels.

Use it for layouts that benefit from user-controlled allocation of space —
file browsers next to a file editor, list/detail views, or master/detail
panels — where users may want to adjust the relative size of the two
panels.

## Implementation Notes

- Uses a `<div class="split-view">` container with `aria-label`
- `data-orientation` reflects `orientation` for consumer styling and tests
- `data-split-percent` reflects `splitPercent` for consumer styling and tests
- The primary panel renders inside `<section class="split-view-primary">`
- The secondary panel renders inside `<section class="split-view-secondary">`
- The divider, if not customized, defaults to `<div class="split-view-divider" role="separator" aria-orientation aria-valuenow aria-valuemin="0" aria-valuemax="100" tabindex="0">`
- Consumers can supply a custom divider via the `divider` slot/snippet/prop

## Props

- `label`: string (**required**) -- aria-label for the container
- `orientation`: `"horizontal" | "vertical"` (default `"horizontal"`) -- divider orientation
- `primary`: slot/snippet/ReactNode (**required**) -- first panel content
- `secondary`: slot/snippet/ReactNode (**required**) -- second panel content
- `divider`: slot/snippet/ReactNode (optional) -- custom divider content
- `splitPercent`: number 0-100 (default `50`) -- initial split position as percentage
- `...restProps`: any additional HTML attributes

## Usage

```html
<SplitView
  label="Files and editor"
  orientation="horizontal"
  splitPercent={30}
  primary={<FileBrowser />}
  secondary={<Editor />}
/>
```

## Keyboard Interactions

- Tab: Move focus to and from the divider
- Arrow keys: (Consumer-provided) move the divider in `orientation`-appropriate increments
- Home / End: (Consumer-provided) snap the divider to its minimum or maximum
- Enter / Space: (Consumer-provided) toggle a collapsed panel

## ARIA

- Container: `aria-label` (required), `data-orientation`, `data-split-percent`
- Default divider: `role="separator"`, `aria-orientation`, `aria-valuenow={splitPercent}`, `aria-valuemin="0"`, `aria-valuemax="100"`, `tabindex="0"`

## When to Use

- Use for two-pane layouts where users benefit from controlling pane size
- Use for list/detail or master/detail views
- Use when content density justifies user-controlled space allocation

## When Not to Use

- Do not use for full page layouts — use `GrailLayout` instead
- Do not use for three-or-more pane layouts — compose multiple split views
- Do not use when the layout proportions are fixed

## Headless

Renders the container, two `<section>` panels, and a focusable
`role="separator"` divider. Drag handling, keyboard resize logic, and
visual treatment are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `split-view` class plus the inner
`split-view-primary`, `split-view-secondary`, and `split-view-divider`
classes. Use `data-orientation` and `data-split-percent` to drive layout
proportions and divider direction.

## Testing

- Verify the component renders a `<div>` with class `split-view`
- Verify `aria-label` equals the `label` prop
- Verify `data-orientation` equals the `orientation` prop
- Verify `data-split-percent` equals the `splitPercent` prop
- Verify primary content renders inside `<section class="split-view-primary">`
- Verify secondary content renders inside `<section class="split-view-secondary">`
- Verify the default divider has `role="separator"`, matching `aria-orientation`, `aria-valuenow={splitPercent}`, `aria-valuemin="0"`, `aria-valuemax="100"`, and `tabindex="0"`
- Verify a custom `divider` slot replaces the default divider when provided

## Advice

- **Designers**: Communicate divider affordance with a hover/focus indicator; ensure it meets minimum 44×44 px target size or provide an enlarged hit area.
- **Developers**: Persist `splitPercent` in user preferences so the layout survives reloads.

## Related components

- `splitter` — a draggable divider for resizing adjacent panels
- `drawer` — a panel that slides in from the edge of the screen
- `sidebar` — a side panel for navigation or supplementary content

## References

- WAI-ARIA Separator: https://www.w3.org/TR/wai-aria-1.2/#separator
- WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- Adobe Spectrum Split View: https://spectrum.adobe.com/page/split-view/

---

Lily™ and Lily Design System™ are trademarks.
