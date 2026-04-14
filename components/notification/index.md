# Notification

A notification is a UI component used to deliver timely messages to users about events, updates, or actions within an application. The Notification component provides a headless wrapper with proper ARIA live region semantics, ensuring that screen readers announce notification content when it appears. It supports both polite (non-urgent) and assertive (urgent) announcements.

The component uses `role="status"` with `aria-live="polite"` for standard notifications that wait for the user to finish their current task before being announced, and `role="alert"` with `aria-live="assertive"` for urgent notifications that interrupt the user immediately. This distinction is critical for appropriate screen reader behavior.

## Implementation Notes

- Renders a `<div>` element with a live region role
- Uses `role="status"` and `aria-live="polite"` by default for non-urgent notifications
- When `urgent` is true, switches to `role="alert"` and `aria-live="assertive"`
- The `label` prop provides an accessible name via `aria-label`
- Content is provided via the `children` slot
- Rest props are spread onto the `<div>` element

## Props

- `label`: string (optional) -- accessible name for the notification region via `aria-label`
- `urgent`: boolean (default: false) -- when true, uses `role="alert"` and `aria-live="assertive"` instead of `role="status"` and `aria-live="polite"`
- `children`: slot (required) -- the notification message content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```html
<!-- Non-urgent notification for new messages -->
<Notification label="New messages">
  You have 3 unread messages
</Notification>

<!-- Non-urgent success notification -->
<Notification label="Success">
  Your changes have been saved.
</Notification>

<!-- Urgent session expiry warning -->
<Notification label="Session warning" urgent>
  Your session will expire in 5 minutes.
  <a href="/session/extend">Extend session</a>.
</Notification>

<!-- Urgent error notification -->
<Notification label="Error" urgent>
  Something went wrong. Please try again.
</Notification>
```

## Keyboard Interactions

None -- this component is a passive announcement container. Notifications are announced automatically by screen readers via ARIA live regions without requiring user interaction.

## ARIA

- `role="status"` -- applied by default for non-urgent notifications; politely announces content changes
- `role="alert"` -- applied when `urgent` is true; assertively interrupts the user
- `aria-label="..."` -- provides an accessible name for the notification region
- `aria-live="polite"` -- default live region politeness; waits for user idle before announcing
- `aria-live="assertive"` -- applied when `urgent` is true; announces immediately

## When to Use

- Use to inform users about events or updates that occurred outside their current context, such as a new message or status change
- Use for brief, time-sensitive messages that appear temporarily and auto-dismiss
- Use when the notification does not require immediate user action -- it is informational only
- Use with `urgent` for critical messages that must immediately interrupt the user, such as errors or security alerts

## When Not to Use

- Do not use for page-level status messages -- use Banner for persistent service-wide information
- Do not use for form validation errors -- use ErrorMessage and ErrorSummary instead
- Do not use for critical warnings that must not be missed -- use Alert or AlertDialog for urgent messages requiring acknowledgment
- Do not use for success confirmations on form completion -- use Banner with success variant or Panel instead

## Headless

This headless component provides a `<div>` with ARIA live region semantics -- `role="status"` with `aria-live="polite"` by default, or `role="alert"` with `aria-live="assertive"` when urgent. The consumer provides all visual styling, including colors, icons, animations, positioning, and auto-dismiss behavior.


## Styles

The consumer provides all CSS styling. The component renders with a `.notification` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `notification`
- Verify role="status"` -- applied by default for non-urgent notifications; politely announces content changes
- Verify role="alert"` -- applied when `urgent` is true; assertively interrupts the user
- Verify aria-label="..."` -- provides an accessible name for the notification region
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use distinct visual styles for different notification types (success, error, warning, info) and ensure notifications do not obscure important page content.
- **Developers**: Use the `urgent` prop only for messages requiring immediate attention. Polite notifications wait for the user to finish their current task before being announced.

## References

- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA Live Regions: https://www.w3.org/WAI/ARIA/apd/practices/live-regions/
