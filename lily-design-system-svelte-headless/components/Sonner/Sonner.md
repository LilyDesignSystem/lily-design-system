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
- `children`: Snippet (required) -- the toast notification content

## Usage

```svelte
<Sonner label="Notifications">
    <div role="status">File saved successfully.</div>
</Sonner>
```

## Keyboard Interactions

None built-in -- the consumer should implement keyboard interactions for dismissing notifications (e.g., Escape key) or navigating between stacked toasts as appropriate.

## ARIA

- `role="region"` -- defines the notification area as a named landmark section
- `aria-label={label}` -- provides an accessible name identifying the notification area
- `aria-live="polite"` -- ensures new content is announced after the screen reader finishes its current output

## References

- WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
