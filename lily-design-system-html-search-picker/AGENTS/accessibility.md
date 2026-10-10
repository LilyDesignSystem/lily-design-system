# Accessibility — `<search-picker>` (HTML helper)

Full write-up: [`../docs/accessibility.md`](../docs/accessibility.md).

- Disclosure pattern: `aria-expanded` + `aria-controls` on the icon
  button; the panel toggles `hidden`.
- The panel is a real `<form role="search">` named by `label` — a search
  landmark — with a native `type="search"` field (`enterkeyhint="search"`)
  named by `input-label` and a native submit button named by
  `submit-label`.
- `⏎` is `aria-hidden`; it is never the accessible name.
- Focus: opening focuses the field, `Escape` returns focus to the button,
  all with `{ preventScroll: true }`. Outside click / focus moving to an
  element outside the root close without moving focus; a focusout with
  no `relatedTarget` (Safari's click on a button) never closes. A successful search closes without
  refocusing, because navigation follows.
