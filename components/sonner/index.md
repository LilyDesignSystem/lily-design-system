# Sonner

A sonner is a component that serves as a toast notification region, providing a designated area where brief, non-intrusive messages appear to inform users of events, confirmations, or status updates. Commonly used for success confirmations, error alerts, progress updates, and system messages, the sonner displays transient notifications that appear and automatically dismiss after a short duration without requiring user interaction.

Unlike modal dialogs that interrupt workflow, toast notifications communicate feedback passively while allowing users to continue their current task. This headless component renders a `<div>` with `role="region"`, `aria-live="polite"`, and an accessible label, ensuring that screen readers announce new notifications without interrupting the current output.

## Implementation Notes

- Renders a `<div>` with `role="region"` to define a named landmark for the notification area
- Uses `aria-live="polite"` so new notifications are announced after the screen reader finishes current output
- Consumer provides individual toast notification elements as children
- Consumer manages toast lifecycle (appearance, auto-dismiss, manual dismiss)
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state -- purely a structural wrapper

## Props

- `label`: string (required) -- accessible name identifying the notification area, applied via `aria-label`
- `children`: slot (required) -- the toast notification content

## Usage

```html
<Sonner label="Notifications">
  <Toast label="Success">Patient record saved successfully.</Toast>
</Sonner>
```

```html
<Sonner label="System notifications">
  <Toast label="Saved">Changes saved.</Toast>
  <Toast label="Synced">Data synchronised with server.</Toast>
  <Toast label="Warning" urgent>Session expires in 2 minutes.</Toast>
</Sonner>
```

## Keyboard Interactions

None built-in -- the consumer should implement keyboard interactions for dismissing notifications (e.g., Escape key) or navigating between stacked toasts as appropriate.

## ARIA

- `role="region"` -- defines the notification area as a named landmark section
- `aria-label={label}` -- provides an accessible name identifying the notification area
- `aria-live="polite"` -- ensures new content is announced after the screen reader finishes its current output

## When to Use

- Use as a toast notification manager to queue and display multiple toast messages.
- Use when your application needs stacked toast management with a designated notification region.
- Use to provide a single `aria-live` region that announces new Toast children to screen readers.
- Use for success confirmations, error alerts, progress updates, and system messages.
- Use one Sonner per page, positioned consistently (e.g., bottom-right).

## When Not to Use

- Do not use for a single standalone toast -- use Toast directly without a Sonner wrapper.
- Do not use for persistent notifications -- use Banner instead.
- Do not use for critical messages requiring acknowledgment -- use AlertDialog instead.

## Headless

This headless component renders a `<div>` with `role="region"`, `aria-live="polite"`, and `aria-label` to create an accessible notification landmark. It provides the live region semantics so screen readers announce new content. The consumer provides all visual styling, positioning, stacking, and animation for the notification area.


## Styles

The consumer provides all CSS styling. The component renders with a `.sonner` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `sonner`
- Verify role="region"` -- defines the notification area as a named landmark section
- Verify aria-label={label}` -- provides an accessible name identifying the notification area
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position the notification region in a consistent screen corner (typically bottom-right or top-right). Limit visible toasts to 3-5 at a time to avoid overwhelming users.
- **Developers**: Manage toast lifecycle (auto-dismiss timers, manual dismiss) in the consumer. Ensure new toasts are appended as children so the `aria-live` region announces them.

## Composition

Sonner serves as the container region that manages Toast notification components. Place individual Toast elements as children inside the Sonner region. The Sonner provides the live region semantics while each Toast provides the individual notification content and dismiss behavior.

## References

- WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
