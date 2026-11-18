# Accessibility

WCAG 2.2 AAA is the target. This states what the control does and what it costs.

## What it does

- **Real controls.** The text is a native `<textarea>` and every tool is a native
  `<button type="button">`: form participation, `required`, spellcheck, IME and
  assistive-technology support all come from the platform.
- **Names are supplied.** The textarea and the toolbar take `label` and
  `toolbarLabel`; each button takes its name from `labels`. Icons are
  `aria-hidden`; no name is ever an icon. Localise them with the rest of your UI.
- **Toolbar pattern.** `role="toolbar"` with a roving tabindex (APG toolbar):
  one tab stop, `←`/`→` move between buttons, `Home`/`End` jump. The toolbar
  `aria-controls` the textarea. Arrows clamp rather than wrap.
- **Focus.** Applying a tool returns focus to the textarea with the formatted
  text still selected, so a keyboard user never loses their place.
- **No colour-only meaning**, no motion, no timers.

## What it costs

**The result is Markdown, and the markers are visible.** A screen-reader user
hears `**bold**` as typed. That is honest — it is what the text contains — but it
is not the same as hearing "bold". Offer a rendered preview alongside if your
readers will not read Markdown.

**Buttons are actions, not toggles.** They do not expose `aria-pressed`, because
the state depends on the selection and would have to be recomputed on every caret
move. The textarea shows the truth: the markers are in the text.

**Shortcuts are a convenience only.** `Ctrl`/`Cmd`+`B`/`I`/`K` can collide with a
screen reader's or the browser's own keys; every tool is also on the toolbar.

**`readonly` leaves the buttons focusable** (`aria-disabled`) so the toolbar stays
discoverable; they do nothing. `disabled` removes them from the tab order.
