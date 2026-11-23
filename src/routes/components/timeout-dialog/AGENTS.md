# TimeoutDialog

## Metadata

- Component: timeout-dialog
- PascalCase: TimeoutDialog
- Description: a modal dialog warning users before session timeout
- Purpose: Warns the user that their session is about to end and lets them extend it, so they do not lose their work. It gives enough time to answer and a way to keep going.
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
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

## Native platform

- Decision: native
- Uses: <dialog> showModal() (always mounted, shown while open)
- Could use: command="close" on its buttons
- Notes: Always mounted, so it is the one dialog a consumer commandfor button could already target. P14-T4 (2026-10-30): showModal() in all nine libraries; React, Vue, Angular and Blazor gained the open prop and role="alertdialog" they lacked. Watch, not adopted (2026-11-21, P23-T10): the dialog closedby attribute ships in Chrome and Edge 134, Firefox 141 and Safari 27.3 (MDN browser-compat-data; webstatus.dev still says limited availability, with no Safari entry). Lily sets none, so a modal keeps the platform default, Escape only; do not pass closedby="any": this dialog asks for an answer, so a click outside must not dismiss it.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <dialog> element with class="timeout-dialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: `.timeout-dialog` in css-style-sheet-template.css
- [MDN dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [WAI-ARIA alertdialog role](https://www.w3.org/TR/wai-aria-1.2/#alertdialog)
