# Sheet

Sheet is a headless sliding panel overlay that appears from an edge of the viewport. It functions as a modal dialog with focus trapping semantics and Escape key support, commonly used for navigation menus, settings panels, detail views, or filter interfaces.

Use Sheet when you need a temporary panel that slides in from the top, right, bottom, or left edge of the screen. The component is conditionally rendered based on its `open` state and exposes a `data-side` attribute indicating which edge it appears from, allowing consumers to apply appropriate slide-in animations and positioning via CSS.

## Implementation Notes

- Conditionally renders a `<div>` element with `role="dialog"` only when `open` is `true`
- Sets `aria-modal="true"` to indicate the dialog is modal and should trap focus
- Sets `tabindex="-1"` to allow programmatic focus on the dialog container
- Exposes a `data-side` attribute with the value of the `side` prop for CSS targeting
- Handles Escape key via an `onkeydown` handler that sets `open` to `false`
- Uses Svelte 5 `$bindable()` for the `open` prop, enabling `bind:open` from the parent
- Consumer is responsible for focus management (moving focus into the sheet when opened)
- Spreads `restProps` onto the dialog div for consumer customization

## Props

- `label`: string (required) -- accessible label for the sheet dialog, applied via `aria-label`
- `open`: boolean (default: `false`) -- whether the sheet is visible; bindable via `bind:open`
- `side`: `"left" | "right" | "top" | "bottom"` (default: `"right"`) -- which edge the sheet appears from
- `children`: Snippet (required) -- content to render inside the sheet
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<Sheet label="Settings" bind:open side="right">
  <p>Sheet content</p>
</Sheet>
```

## Keyboard Interactions

- Escape: Closes the sheet by setting `open` to `false`
- Tab: Moves focus between focusable elements within the sheet (consumer should implement focus trapping)

## ARIA

- `role="dialog"` -- identifies the sheet as a dialog window
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- indicates the dialog is modal, meaning content behind it is inert

## References

- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA Authoring Practices - Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/
