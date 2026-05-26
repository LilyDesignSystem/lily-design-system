# TimeoutDialog

A modal dialog warning users before session timeout, giving them a clear chance to keep working before unsaved data is lost or they are signed out.

The component is built on the native `<dialog>` element opened via `showModal()` so that focus is trapped and the rest of the page becomes inert. It uses `role="alertdialog"` so screen readers announce the warning as an interruption that requires immediate attention. The consumer drives the countdown — the component takes a live `remainingSeconds` prop and re-renders the visible time, but does not start, stop, or reset any timer of its own.

Common in services that hold sensitive data (banking, government, healthcare) where automatic sign-out is a regulatory requirement, but where the user still deserves an opportunity to extend the session before being kicked out.

## Implementation Notes

- Renders a native `<dialog>` opened with `showModal()` so the dialog is modal and focus-trapped automatically
- `role="alertdialog"` ensures assistive technology announces it as an interruption
- Provides two slots: a body for the warning message (and remaining time) and a footer for action buttons
- Common buttons are "Stay signed in" (extends the session) and "Sign out" (ends the session immediately)
- Consumer drives the countdown clock; the component re-renders when `remainingSeconds` changes
- Closes via `close()` on the dialog element, returning focus to the previously focused element

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | string (required) | — | Dialog heading |
| `open` | boolean | false | Whether the dialog is open; bindable |
| `remainingSeconds` | number (required) | — | Seconds remaining before timeout |
| `onExtend` | callback | — | Fired when the user chooses to stay signed in |
| `onSignOut` | callback | — | Fired when the user chooses to sign out now |
| `...restProps` | HTML attributes | — | Spread onto the root `<dialog>` |

## Usage

```html
<TimeoutDialog title="You are about to be signed out" open={isOpen} remainingSeconds={120}
  onExtend={extendSession} onSignOut={signOutNow} />
```

## Keyboard Interactions

- Tab / Shift+Tab cycles between focusable elements inside the dialog (focus trap)
- Escape: triggers `cancel` (consumer typically wires this to "Sign out" or "Stay signed in")
- Enter: activates the focused button (native browser behaviour)

## ARIA

- `role="alertdialog"` identifies this as an interruption requiring user attention
- `aria-labelledby` references the heading element
- `aria-describedby` references the body content

## When to Use

- Warning users before an inactive session ends, giving them a chance to extend it
- Any context where automatic timeout is a security or data-integrity requirement

## When Not to Use

- Use `AlertDialog` for non-timeout urgent confirmations
- Use `Dialog` for general modal content without alert semantics

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.timeout-dialog` as the root class. No default styles are included.

## Related components

- `dialog` — generic modal dialog
- `alert-dialog` — modal dialog for urgent confirmations

## References

- [MDN dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [WAI-ARIA alertdialog role](https://www.w3.org/TR/wai-aria-1.2/#alertdialog)
