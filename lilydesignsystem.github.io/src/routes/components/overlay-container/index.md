# Overlay Container

An overlay container is a full-viewport backdrop element that sits behind
modal dialogs, drawers, and sheets. It exposes an `open` state, forwards a
backdrop-click handler, and toggles `aria-hidden` and the native `hidden`
attribute so that assistive technology and keyboard focus behave correctly
when the overlay is dismissed.

Use it as the structural backdrop layer underneath any modal surface
(Dialog, AlertDialog, Drawer, Sheet) where clicking the backdrop should
close the overlay or where a darkened scrim is required.

## Implementation Notes

- Renders a `<div>` with `class="overlay-container"` and `role="presentation"` because the actual modal child is the dialog
- Sets `data-open={open}` for consumer CSS hooks
- Sets `aria-hidden={!open}` so assistive technology ignores the backdrop when closed
- Applies the native `hidden` attribute when `open` is false so it is removed from the layout tree
- Forwards click events via `onclick` / `onClick` so the consumer can implement backdrop-close
- Provides no visual styling itself — the consumer applies background, blur, and pointer-events

## Props

- `open`: boolean (default: false) -- whether the overlay is visible
- `label`: string (optional) -- aria-label
- `onclick` / `onClick`: callback (optional) -- click handler (typically backdrop-close)
- `children`: slot -- overlay content (typically a dialog or sheet)
- `...restProps`: any additional HTML attributes

## Usage

Backdrop wrapping a dialog:

```html
<OverlayContainer open={isOpen} onclick={close} label="Modal backdrop">
  <Dialog open={isOpen}>...</Dialog>
</OverlayContainer>
```

Closed by default:

```html
<OverlayContainer>
  <Sheet>...</Sheet>
</OverlayContainer>
```

## Keyboard Interactions

- None on the backdrop itself
- The dialog or sheet inside manages focus trap, Escape-to-close, and other modal keyboard behavior

## ARIA

- `role="presentation"` so the backdrop has no implicit semantics
- `aria-hidden={!open}` keeps the closed backdrop out of the accessibility tree
- The actual modal surface inside should carry `role="dialog"` (or `role="alertdialog"`) and `aria-modal`

## When to Use

- Use as the backdrop layer behind a Dialog, AlertDialog, Drawer, Sheet, or other modal surface.
- Use when clicking outside the modal should dismiss it.
- Use when a visual scrim is needed to dim the rest of the page.

## When Not to Use

- Do not use as the modal itself — wrap a Dialog or similar component as a child.
- Do not use for non-modal popovers or tooltips (use Popover, Tooltip).
- Do not rely on it to trap focus — focus trapping is the dialog's job.

## Headless

Provides only the open/close visibility plumbing, ARIA wiring, and click
handler forwarding. The backdrop color, blur, transition, and pointer-events
are entirely the consumer's responsibility.

## Styles

Consumer CSS targets `.overlay-container[data-open="true"]` to apply
background color, opacity, and transitions. The default closed state is fully
removed from layout via the native `hidden` attribute.

## Testing

- Verify the component renders a `<div>` element with class `overlay-container`
- Verify `role="presentation"` is applied
- Verify `data-open` matches the `open` prop value
- Verify `aria-hidden` equals `!open`
- Verify the `hidden` attribute is applied when `open` is false
- Verify the click handler fires on click
- Verify children content is rendered

## Advice

- **Designers**: A scrim should reduce content contrast just enough to focus the user on the modal — typically 40–60% black at low opacity. Avoid full opacity which hides context entirely.
- **Developers**: Pair the OverlayContainer with a focus-trapping Dialog inside. Hook the backdrop click only when the underlying dialog is dismissible — destructive flows should not close on backdrop click.

## Related components

- `dialog` — a modal or non-modal dialog window
- `drawer` — a panel that slides in from the edge of the screen
- `sheet` — a panel that slides in from a screen edge as an overlay

## References

- WAI-ARIA dialog pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA presentation role: https://www.w3.org/TR/wai-aria-1.2/#presentation

---

Lily™ and Lily Design System™ are trademarks.
