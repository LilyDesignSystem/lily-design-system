# Toast

A toast is a UI/UX component that provides a brief, transient notification message to the user. It uses `role="status"` with `aria-live="polite"` by default, or `role="alert"` with `aria-live="assertive"` for urgent messages. Toasts are typically displayed temporarily to confirm actions, report errors, or provide status updates without requiring user interaction.

Toasts are similar to notifications but are generally more ephemeral and less intrusive. They are commonly used for success confirmations ("Item saved"), error messages ("Connection lost"), and informational updates ("New message received").

## Implementation Notes

- Renders a `<div>` element with a live region role for screen reader announcements
- Uses conditional role assignment: `role="status"` for normal messages, `role="alert"` for urgent ones
- Uses conditional `aria-live`: `"polite"` waits for a pause in speech, `"assertive"` interrupts immediately
- The `urgent` prop controls both the role and aria-live behavior simultaneously
- Accepts a `children` slot for flexible toast content
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `class`)
- slot pattern used for the `children` prop (imported from "svelte")

## Props

- `label`: string (default: undefined) -- optional accessible label applied via `aria-label`
- `urgent`: boolean (default: false) -- when true, uses `role="alert"` and `aria-live="assertive"` instead of `role="status"` and `aria-live="polite"`
- `children`: slot (required) -- the toast message content
- `...restProps`: spread onto the `<div>` element

## Usage

```html
<Toast label="Success">Patient record saved successfully.</Toast>
```

```html
<Toast label="Error" urgent>Failed to save changes. Please try again.</Toast>
```

```html
<Toast label="Copied">
  <p>NHS number copied to clipboard.</p>
</Toast>
```

```html
<Sonner label="Notifications">
  <Toast label="Update">Record updated by Dr Chen at 14:32.</Toast>
</Sonner>
```

## Keyboard Interactions

None -- this component is a passive notification container. Toasts are announced by screen readers through live regions and do not receive keyboard focus.

## ARIA

- `role="status"` -- (default) identifies a live region with advisory information, announced at the next graceful opportunity
- `role="alert"` -- (when `urgent` is true) identifies a live region with important, time-sensitive information, announced immediately
- `aria-live="polite"` -- (default) screen reader waits for a pause before announcing the content
- `aria-live="assertive"` -- (when `urgent` is true) screen reader interrupts current speech to announce the content
- `aria-label={label}` -- optional descriptive label for the toast region

## When to Use

- Use for brief auto-dismissing notification messages such as "Saved", "Copied", or "Record updated".
- Use when the message does not require user interaction and can auto-dismiss after a short time.
- Use for success confirmations, informational updates, and non-critical error feedback.
- Use inside a Sonner container when managing multiple stacked toast notifications.
- Use the `urgent` prop sparingly, only for time-sensitive error messages.

## When Not to Use

- Do not use for persistent messages -- use Banner instead.
- Do not use for form validation errors -- use ErrorSummary instead.
- Do not use for critical alerts requiring user acknowledgment -- use AlertDialog instead.
- Do not use for content that users need to reference later -- use Notification or InformationCallout instead.

## Headless

This headless component provides a `<div>` with a live region role (`role="status"` or `role="alert"`) and appropriate `aria-live` behavior for screen reader announcements. The consumer provides all content, visual styling, positioning, animation, and auto-dismiss logic.


## Styles

The consumer provides all CSS styling. The component renders with a `.toast` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `toast`
- Verify role="status"` -- (default) identifies a live region with advisory information, announced at the next graceful opportunity
- Verify role="alert"` -- (when `urgent` is true) identifies a live region with important, time-sensitive information, announced immediately
- Verify aria-label={label}` -- optional descriptive label for the toast region
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position toasts consistently (e.g., bottom-right or top-center) and use color/icon cues to distinguish success, error, and informational messages.
- **Developers**: Set `urgent={true}` only for error or time-sensitive messages. For normal confirmations, use the default polite behavior to avoid interrupting screen reader users.

## References

- WAI-ARIA Alert Role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
