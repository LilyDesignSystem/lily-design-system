# Notification

A notification is a UI component used to deliver timely messages to users about events, updates, or actions within an application. The Notification component provides a headless wrapper with proper ARIA live region semantics, ensuring that screen readers announce notification content when it appears. It supports both polite (non-urgent) and assertive (urgent) announcements.

The component uses `role="status"` with `aria-live="polite"` for standard notifications that wait for the user to finish their current task before being announced, and `role="alert"` with `aria-live="assertive"` for urgent notifications that interrupt the user immediately. This distinction is critical for appropriate screen reader behavior.

## Implementation Notes

- Renders a `<div>` element with a live region role
- Uses `role="status"` and `aria-live="polite"` by default for non-urgent notifications
- When `urgent` is true, switches to `role="alert"` and `aria-live="assertive"`
- The `label` prop provides an accessible name via `aria-label`
- Content is provided via the `children` snippet
- Rest props are spread onto the `<div>` element

## Props

- `label`: string (optional) -- accessible name for the notification region via `aria-label`
- `urgent`: boolean (default: false) -- when true, uses `role="alert"` and `aria-live="assertive"` instead of `role="status"` and `aria-live="polite"`
- `children`: Snippet (required) -- the notification message content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<!-- Non-urgent notification (polite) -->
<Notification label="Success">Your changes have been saved.</Notification>

<!-- Urgent notification (assertive) -->
<Notification label="Error" urgent>Something went wrong. Please try again.</Notification>

<!-- Notification without explicit label -->
<Notification>3 new messages</Notification>
```

## Keyboard Interactions

None -- this component is a passive announcement container. Notifications are announced automatically by screen readers via ARIA live regions without requiring user interaction.

## ARIA

- `role="status"` -- applied by default for non-urgent notifications; politely announces content changes
- `role="alert"` -- applied when `urgent` is true; assertively interrupts the user
- `aria-label="..."` -- provides an accessible name for the notification region
- `aria-live="polite"` -- default live region politeness; waits for user idle before announcing
- `aria-live="assertive"` -- applied when `urgent` is true; announces immediately

## References

- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA Live Regions: https://www.w3.org/WAI/ARIA/apd/practices/live-regions/
