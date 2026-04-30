# TimeoutDialog

## Metadata

- Component: timeout-dialog
- PascalCase: TimeoutDialog
- Description: a modal dialog warning users before session timeout
- HTML tag: <dialog>
- CSS class: .timeout-dialog
- Interactive: yes

## Key Behaviors

- Renders a native `<dialog>` opened with `showModal()` so the dialog is modal and focus-trapped automatically
- `role="alertdialog"` ensures assistive technology announces it as an interruption
- Provides two slots: a body for the warning message (and remaining time) and a footer for action buttons
- Common buttons are "Stay signed in" (extends the session) and "Sign out" (ends the session immediately)
- Consumer drives the countdown clock; the component re-renders when `remainingSeconds` changes
- Closes via `close()` on the dialog element, returning focus to the previously focused element

## ARIA

- `role="alertdialog"` identifies this as an interruption requiring user attention
- `aria-labelledby` references the heading element
- `aria-describedby` references the body content

## Keyboard

- Tab / Shift+Tab cycles between focusable elements inside the dialog (focus trap)
- Escape: triggers `cancel` (consumer typically wires this to "Sign out" or "Stay signed in")
- Enter: activates the focused button (native browser behaviour)

## Props

- `title`: string (required) (default: —) — Dialog heading
- `open`: boolean (default: false) — Whether the dialog is open; bindable
- `remainingSeconds`: number (required) (default: —) — Seconds remaining before timeout
- `onExtend`: callback (default: —) — Fired when the user chooses to stay signed in
- `onSignOut`: callback (default: —) — Fired when the user chooses to sign out now
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<dialog>`

## Acceptance Criteria

- [ ] Renders <dialog> element with class="timeout-dialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.timeout-dialog` in css-style-sheet-template.css
- [MDN dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [WAI-ARIA alertdialog role](https://www.w3.org/TR/wai-aria-1.2/#alertdialog)
