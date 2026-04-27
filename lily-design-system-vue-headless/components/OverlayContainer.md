# OverlayContainer

A full-viewport overlay backdrop for modals, sheets, and drawers. Renders a `<div role="presentation" class="overlay-container">` with `data-open`, `aria-hidden`, and `hidden` attributes mirroring the `open` prop.

## Implementation Notes

- Headless: no CSS or styles — consumer provides the backdrop styling
- `role="presentation"` so the backdrop element is not announced; the modal child supplies `role="dialog"`
- `hidden` attribute removes the overlay from layout when closed
- `aria-hidden` mirrors the inverse of `open`

## Props

- `open`: boolean (default `false`)
- `label`: string (optional) — `aria-label`
- default slot — overlay content (typically a `Dialog` or `Sheet`)
- `...$attrs` — additional HTML attributes

## Events

- `click(event: MouseEvent)` — typically used for backdrop-dismiss

## Usage

```vue
<OverlayContainer :open="isOpen" @click="close">
    <div role="dialog">Modal content</div>
</OverlayContainer>
```

## Keyboard Interactions

- None at this level. Focus management belongs to the dialog child.

## ARIA

- `role="presentation"` on the backdrop
- `aria-hidden` reflects `!open`
- `hidden` attribute when closed

## When to Use

- Backdrops for dialogs, sheets, drawers, popovers

## When Not to Use

- For inline content overlays (tooltips, hover cards) — use `Popover` or `HoverCard`

## Headless

The component renders structural and ARIA markup only. Consumers add visual styling (background, blur, transitions) via the `overlay-container` class.

## Testing

- Verify root class and `role="presentation"`
- Verify `hidden`, `aria-hidden`, and `data-open` flip with the `open` prop
- Verify the `click` event is emitted

## References

- [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
