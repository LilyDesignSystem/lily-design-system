# Sheet

Sheet is a headless sliding panel overlay that appears from an edge of the viewport. It is a modal dialog, a native `<dialog>` opened with `showModal()` (inert page behind, Tab trapped, focus returned to the trigger on close), with Escape key support, commonly used for navigation menus, settings panels, detail views, or filter interfaces.

Use Sheet when you need a temporary panel that slides in from the top, right, bottom, or left edge of the screen. The component is conditionally rendered based on its `open` state and exposes a `data-side` attribute indicating which edge it appears from, allowing consumers to apply appropriate slide-in animations and positioning via CSS.

## Implementation Notes

- Conditionally renders a native `<dialog>` element only when `open` is `true`
- Opened with `showModal()`: the browser puts it in the top layer, makes the page behind it inert, traps Tab inside it and moves focus in; on close, focus returns to the element that opened it. Escape (keydown or the native `cancel` event) closes it. Where `showModal` is missing (jsdom) it falls back to the `open` attribute
- Sets `aria-modal="true"`, which `showModal()` makes true
- Sets `tabindex="-1"` to allow programmatic focus on the dialog container
- Exposes a `data-side` attribute with the value of the `side` prop for CSS targeting
- Handles Escape key via an `onKeyDown` handler that sets `open` to `false`
- Supports controlled component usage for the `open` prop
- Spreads `restProps` onto the dialog div for consumer customization

## Props

- `label`: string (required) -- accessible label for the sheet dialog, applied via `aria-label`
- `open`: boolean (default: `false`) -- whether the sheet is visible; controlled
- `side`: `"left" | "right" | "top" | "bottom"` (default: `"right"`) -- which edge the sheet appears from
- `children`: ReactNode (required) -- content to render inside the sheet
- `...restProps`: unknown -- additional attributes spread onto the `<dialog>` element

## Usage

```tsx
<Sheet
  label="Settings"
  open={isOpen}
  onChange={setIsOpen}
  side="right"
>
  <p>Sheet content</p>
</Sheet>
```

## Keyboard Interactions

- Escape: Closes the sheet by setting `open` to `false`
- Tab: Moves focus between focusable elements within the sheet (`showModal()` keeps focus inside the sheet)

## ARIA

- `role="dialog"` -- provided natively by the `<dialog>` element
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- indicates the dialog is modal, meaning content behind it is inert

## References

- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA Authoring Practices - Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/
