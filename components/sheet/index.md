# Sheet

Sheet is a headless sliding panel overlay that appears from an edge of the viewport. It functions as a modal dialog with focus trapping semantics and Escape key support, commonly used for navigation menus, settings panels, detail views, or filter interfaces.

Use Sheet when you need a temporary panel that slides in from the top, right, bottom, or left edge of the screen. The component is conditionally rendered based on its `open` state and exposes a `data-side` attribute indicating which edge it appears from, allowing consumers to apply appropriate slide-in animations and positioning via CSS.

## Implementation Notes

- Conditionally renders a `<div>` element with `role="dialog"` only when `open` is `true`
- Sets `aria-modal="true"` to indicate the dialog is modal and should trap focus
- Sets `tabindex="-1"` to allow programmatic focus on the dialog container
- Exposes a `data-side` attribute with the value of the `side` prop for CSS targeting
- Handles Escape key via an `onkeydown` handler that sets `open` to `false`
- Supports two-way binding for the `open` prop, enabling two-way `open` binding from the parent
- Consumer is responsible for focus management (moving focus into the sheet when opened)
- Spreads `restProps` onto the dialog div for consumer customization

## Props

- `label`: string (required) -- accessible label for the sheet dialog, applied via `aria-label`
- `open`: boolean (default: `false`) -- whether the sheet is visible; two-way bindable via `open`
- `side`: `"left" | "right" | "top" | "bottom"` (default: `"right"`) -- which edge the sheet appears from
- `children`: slot (required) -- content to render inside the sheet
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

Settings panel sliding in from the right:

```html
<Sheet label="Settings" open={settingsOpen} side="right">
  <h2>Preferences</h2>
  <form>
    <label><input type="checkbox" /> Enable notifications</label>
    <label><input type="checkbox" /> Dark mode</label>
  </form>
  <button onclick={() => (settingsOpen = false)}>Close</button>
</Sheet>
```

Mobile action sheet sliding up from the bottom:

```html
<Sheet label="Share options" open={shareOpen} side="bottom">
  <ul>
    <li><button>Copy link</button></li>
    <li><button>Email</button></li>
    <li><button>Print</button></li>
  </ul>
</Sheet>
```

## Keyboard Interactions

- Escape: Closes the sheet by setting `open` to `false`
- Tab: Moves focus between focusable elements within the sheet (consumer should implement focus trapping)

## ARIA

- `role="dialog"` -- identifies the sheet as a dialog window
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- indicates the dialog is modal, meaning content behind it is inert

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

This headless component provides a modal dialog container with `role="dialog"`, `aria-modal="true"`, `aria-label`, Escape key dismissal, and a `data-side` attribute for CSS targeting. The consumer provides all visual styling including slide-in animations, backdrop, positioning, and focus management.


## Styles

The consumer provides all CSS styling. The component renders with a `.sheet` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `sheet`
- Verify role="dialog"` -- identifies the sheet as a dialog window
- Verify aria-label={label}` -- provides an accessible name for the dialog
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include a visible close button and a semi-transparent backdrop so users understand the panel is an overlay. Animate the slide-in transition to reinforce which edge the sheet originates from.
- **Developers**: Implement focus trapping so keyboard users cannot tab behind the sheet. Move focus into the sheet on open and restore focus to the trigger element on close.

## References

- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA Authoring Practices - Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/
