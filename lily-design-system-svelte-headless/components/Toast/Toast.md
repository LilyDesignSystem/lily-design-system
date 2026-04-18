# Toast

A toast is a UI/UX component that provides a brief, transient notification message to the user. It uses `role="status"` with `aria-live="polite"` by default, or `role="alert"` with `aria-live="assertive"` for urgent messages. Toasts are typically displayed temporarily to confirm actions, report errors, or provide status updates without requiring user interaction.

Toasts are similar to notifications but are generally more ephemeral and less intrusive. They are commonly used for success confirmations ("Item saved"), error messages ("Connection lost"), and informational updates ("New message received").

## Implementation Notes

- Renders a `<div>` element with a live region role for screen reader announcements
- Uses conditional role assignment: `role="status"` for normal messages, `role="alert"` for urgent ones
- Uses conditional `aria-live`: `"polite"` waits for a pause in speech, `"assertive"` interrupts immediately
- The `urgent` prop controls both the role and aria-live behavior simultaneously
- Accepts a `children` Snippet for flexible toast content
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `class`)
- Svelte 5 Snippet pattern used for the `children` prop (imported from "svelte")

## Props

- `label`: string (default: undefined) -- optional accessible label applied via `aria-label`
- `urgent`: boolean (default: false) -- when true, uses `role="alert"` and `aria-live="assertive"` instead of `role="status"` and `aria-live="polite"`
- `children`: Snippet (required) -- the toast message content
- `...restProps`: spread onto the `<div>` element

## Usage

```svelte
<Toast label="Success">Your changes have been saved.</Toast>
```

```svelte
<Toast label="Error" urgent>Something went wrong.</Toast>
```

```svelte
<Toast label="Info">
  <p>3 new messages in your inbox.</p>
</Toast>
```

## Keyboard Interactions

None -- this component is a passive notification container. Toasts are announced by screen readers through live regions and do not receive keyboard focus.

## ARIA

- `role="status"` -- (default) identifies a live region with advisory information, announced at the next graceful opportunity
- `role="alert"` -- (when `urgent` is true) identifies a live region with important, time-sensitive information, announced immediately
- `aria-live="polite"` -- (default) screen reader waits for a pause before announcing the content
- `aria-live="assertive"` -- (when `urgent` is true) screen reader interrupts current speech to announce the content
- `aria-label={label}` -- optional descriptive label for the toast region

## References

- WAI-ARIA Alert Role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
