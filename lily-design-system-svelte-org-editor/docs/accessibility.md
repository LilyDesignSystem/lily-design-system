# Accessibility

WCAG 2.2 AAA is the target. This states what the control does and what it costs.

## What it does

- **Real controls.** The text is a native `<textarea>` and every tool is a native `<button type="button">`: form
  participation, `required`, spellcheck, IME and assistive-technology support come from the platform.
- **Names are supplied.** The textarea, the toolbar and every button take their names from `label`,
  `toolbarLabel` and `labels`. Icons are `aria-hidden`; no name is ever an icon.
- **Toolbar pattern.** `role="toolbar"` with a roving tabindex (APG toolbar): one tab stop, `←`/`→` move
  between buttons, `Home`/`End` jump, arrows clamp. The toolbar `aria-controls` the textarea. With 23 tools
  that one tab stop matters: a keyboard user crosses the toolbar in one Tab, not twenty-three.
- **Focus.** Applying a tool returns focus to the textarea with the affected text still selected.
- **No colour-only meaning**, no motion, no timers.

## What it costs

**The result is Org source, and the markers are visible.** A screen-reader user hears `*bold*`, `/italic/` and
`SCHEDULED: <2026-10-24 Sat>` as written. That is honest, and it is what an Org user edits anyway, but it is
not the same as hearing "bold" or "scheduled for Saturday".

**A tool that cannot act does nothing, silently.** Pressing Scheduled with no heading above the caret leaves
the text unchanged and fires no `onchange`. There is no announcement, because the component has no strings of
its own; if that matters in your app, show your own message from your own `onchange` / selection logic.

**Many buttons.** 23 tools is a lot of controls. Pass `tools` to show only the ones a task needs, grouped as
you like with `data-group`.

**Shortcuts are a convenience only.** `Ctrl`/`Cmd` + `B`/`I`/`U`/`K` can collide with a screen reader's or the
browser's own keys; every tool is also on the toolbar.

**`readonly` leaves the buttons focusable** (`aria-disabled`) so the toolbar stays discoverable; they do
nothing. `disabled` removes them from the tab order.
