# Sheet

Sheet is a headless sliding panel overlay that appears from an edge of the viewport. It is a real modal: a native `<dialog>` opened with `showModal()`, so the page behind it is inert, Tab stays inside it, Escape closes it and focus returns to the opener. It is commonly used for navigation menus, settings panels, detail views, or filter interfaces.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

Use Sheet when you need a temporary panel that slides in from the top, right, bottom, or left edge of the screen. The component is conditionally rendered based on its `open` state and exposes a `data-side` attribute indicating which edge it appears from, allowing consumers to apply appropriate slide-in animations and positioning via CSS.

## Implementation Notes

- Conditionally renders a native `<dialog>` only when `open` is `true`, opened with `showModal()` (falls back to the `open` attribute where `showModal` is missing)
- Is modal, so `aria-modal="true"` is true: the page behind is inert and Tab cannot leave
- Sets `tabindex="-1"` to allow programmatic focus on the dialog container
- Exposes a `data-side` attribute with the value of the `side` prop for CSS targeting
- Handles Escape key via an `onkeydown` handler that sets `open` to `false`
- Supports two-way binding for the `open` prop, enabling two-way `open` binding from the parent
- Moves focus into the sheet on open and returns it to the opener on close (no consumer focus management needed)
- Spreads `restProps` onto the `<dialog>` for consumer customization

## Props

- `label`: string (required) -- accessible label for the sheet dialog, applied via `aria-label`
- `open`: boolean (default: `false`) -- whether the sheet is visible; two-way bindable via `open`
- `side`: `"left" | "right" | "top" | "bottom"` (default: `"right"`) -- which edge the sheet appears from
- `children`: slot (required) -- content to render inside the sheet
- `...restProps`: unknown -- additional attributes spread onto the `<dialog>` element

## Usage

Settings panel sliding in from the right:

```html
<Sheet
  label="Settings"
  open="{settingsOpen}"
  side="right"
>
  <h2>Preferences</h2>
  <form>
    <label><input type="checkbox" /> Enable notifications</label>
    <label><input type="checkbox" /> Dark mode</label>
  </form>
  <button
    onclick="{()"
    =""
  >
    (settingsOpen = false)}>Close
  </button>
</Sheet>
```

Mobile action sheet sliding up from the bottom:

```html
<Sheet
  label="Share options"
  open="{shareOpen}"
  side="bottom"
>
  <ul>
    <li><button>Copy link</button></li>
    <li><button>Email</button></li>
    <li><button>Print</button></li>
  </ul>
</Sheet>
```

## Keyboard Interactions

- Escape: Closes the sheet by setting `open` to `false`
- Tab: Moves focus between focusable elements within the sheet; focus cannot leave while it is open

## ARIA

- `role="dialog"` -- implicit on the native `<dialog>` element
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- true: `showModal()` makes the content behind it inert

## When to Use

- Use for a panel that slides in from a screen edge as an overlay, commonly from the bottom on mobile.
- Use when you need a temporary overlay for navigation, settings, filters, or detail views.
- Use when the content should overlay the page rather than navigate away from it.
- Use for action sheets on mobile that present a list of options from the bottom.

## When Not to Use

- Do not use for side navigation -- use Drawer or Sidebar instead.
- Do not use for modal dialogs that should be centered -- use Dialog instead.
- Do not use for critical confirmations or urgent messages -- use AlertDialog instead.

## Headless

This headless component provides a modal `<dialog>` opened with `showModal()` (top layer, inert page, Tab trap, focus return), `aria-modal="true"`, `aria-label`, Escape key dismissal, and a `data-side` attribute for CSS targeting. The consumer provides all visual styling including slide-in animations, the `::backdrop`, and positioning (reset the user-agent `<dialog>` margin, inset and max-height for an edge-docked panel).

## Styles

The consumer provides all CSS styling. The component renders with a `.sheet` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<dialog>` element with class `sheet`, opened with `showModal()`
- Verify focus moves inside on open, stays inside while open, and returns to the trigger on close
- Verify role="dialog"` -- identifies the sheet as a dialog window
- Verify aria-label={label}` -- provides an accessible name for the dialog
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include a visible close button and a semi-transparent backdrop so users understand the panel is an overlay. Animate the slide-in transition to reinforce which edge the sheet originates from.
- **Developers**: Focus trapping, focus into the sheet on open and focus return on close come from `showModal()`; open the sheet from a button so focus has somewhere to return to.

## Related components

- `drawer` — a panel that slides in from the edge of the screen
- `dialog` — a modal or non-modal dialog window
- `slide-out-drawer` — a drawer that slides out from the side of the page

## References

- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA Authoring Practices - Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/

---

Lily™ and Lily Design System™ are trademarks.
