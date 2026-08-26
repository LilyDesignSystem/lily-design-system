# Changelog — TextSizePicker (HTML)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.1 — 2026-08-26

Fixed: **a pointer click on the button opened and instantly closed the
popup**, making it unusable with a mouse. A trusted click targets the
icon `<span>`; opening runs the state sync, whose `replaceChildren()`
on the button content detaches that span mid-event, so when the same
click bubbled to the document, the outside-click containment check saw
a detached target, judged the click "outside", and closed the popup on
the very click that opened it. Synthetic `button.click()` targets the
button element, which survives the swap — which is why the whole suite
stayed green over it. The handler now judges the click by its
`composedPath()` snapshot, which is immune to mid-event re-renders,
and a regression test clicks the icon span and asserts the popup
stays open (confirmed to fail without the fix).

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Pointer-selection close audited (2026-07-31)

#### Unchanged

- The pointer-selection contract was audited across all seven catalogs
  after a report that a selection might leave the listbox open. This
  catalog already specified *and* asserted the close (`§7.4` — "clicking
  an option selects it, applies it, and closes the listbox", with both
  `hidden` and `aria-expanded` checked), so it needed no change; the
  other six were brought up to it.

### Idempotent apply (2026-07-31)

#### Fixed

- **Applying the same size twice is now a no-op**, so `textsizechange` fires
  once per changed value rather than once per apply.
  `attributeChangedCallback` runs on every `setAttribute("value", …)` —
  unchanged value included — so a listener that mirrored the value back
  onto the element re-entered apply without limit, re-writing the DOM and
  re-dispatching until the stack blew. Disconnecting clears the record,
  so a re-connected element applies again. Ported from the canonical
  Svelte helper, which had the same defect through its reactive effect.

### Accessibility hardening (2026-07-29/30)

#### Changed

- **`Tab` from the open list no longer strands keyboard focus.** The
  handler hid the list while it had focus; the browser then moved focus
  to `<body>` and the default Tab restarted from the top of the
  document. Focus now goes to the trigger button first — without
  cancelling the key — so the default Tab proceeds from the picker's
  own position.
- **Typeahead follows the APG single-character rule.** A single
  character advances to the *next* matching option, and repeating that
  character cycles through the matches; only a buffer of differing
  characters refines the match anchored on the active option.
  Previously a character that matched the active option went nowhere.

#### Added

- **`PageUp` / `PageDown`** move the active option by ten, clamped —
  an APG-optional key for long lists.

#### Fixed

- Opening with an empty option list no longer points
  `aria-activedescendant` at an id that does not exist. (`openList()`
  used to refuse to open at all with zero options; it now opens an
  empty listbox with no active descendant, matching the canonical
  Svelte helper.)

### Initial entry — 2026-07-21

First release under the name
`lily-design-system-html-text-size-picker`. The version resets to
0.1.0 because this package name has never been published; a renamed
package carries no release history.

#### Added

- `<text-size-picker>` custom element: a headless text-size control.
  It renders an icon button (the letter "A", U+0041) that opens a
  WAI-ARIA APG listbox of sizes. Light DOM only; ships no CSS.
- On each applied size it sets `data-text-size` on `target` (default
  `document.documentElement`), optionally persists to
  `localStorage[storageKey]`, and dispatches a `textsizechange`
  `CustomEvent`. Consumer CSS maps the values to actual sizing.
- Class hooks `text-size-picker`, `text-size-picker-button`,
  `text-size-picker-icon`, `text-size-picker-list`,
  `text-size-picker-option`.
- Named exports including `TextSizePicker`, `sizeName`,
  `nextTextSizePickerId`; types `TextSizePickerProps`,
  `TextSizePickerChangeDetail`.

#### Changed

- Renamed from `lily-design-system-html-text-size-select`. The custom
  element is `<text-size-picker>` (was `<text-size-picker>`), the
  class is `TextSizePicker` (was `TextSizePicker`), and the class
  hooks are `text-size-picker*` (were `text-size-picker*`). Behaviour
  is unchanged.

Previously released in-tree as
`lily-design-system-html-text-size-select`; that history is preserved
below and did not ship under the current package name.

---

## Prior history — released in-tree as `lily-design-system-html-text-size-select`

### 0.2.0 — 2026-07-21

#### Changed (BREAKING)

- **No longer a native `<select>`.** This helper is now an icon button
  that opens a WAI-ARIA APG listbox, matching `theme-picker` and
  `locale-picker`; it was the last native `<select>` among the helpers.
  Root is `<div class="text-size-picker">` wrapping a hidden input
  (form participation, carries `name`), a
  `<button class="text-size-picker-button">` whose only content is an
  `aria-hidden` glyph span, and a
  `<ul class="text-size-picker-list" role="listbox" hidden>` of
  `<li role="option">`.
- Option count, option elements, and any assertion against a `<select>`
  or `<option>` all change. The `children` slot now overrides the
  **glyph**, not the options.
- Keyboard is hand-rolled to the APG listbox contract rather than
  inherited from the platform: ArrowDown / ArrowUp / Enter / Space open
  (ArrowUp starts on the last option), arrows clamp rather than wrap,
  Home / End jump, printable characters typeahead over labels, Enter /
  Space select and return focus to the button, Escape closes without
  changing the value, Tab closes and moves on.

#### Added

- Button glyph `"A"` (U+0041). The obvious candidate, U+1F5DB DECREASE
  FONT SIZE SYMBOL, has no real glyph in common font stacks and falls
  back to a crude bitmap shape — and it means _decrease_ rather than
  _size_. A plain in-font letter renders everywhere and stays
  monochrome alongside the sibling glyphs.
- `sizeName` exported, mirroring `themeName` / `localeName`; the
  internal `labelFor` delegates to it.

#### Unchanged

- `data-text-size` application, `localStorage` persistence, `onChange`,
  and initial-value resolution (`value` > storage > `defaultValue` >
  `"medium"` > `sizes[0]`).
- No first-visit detection prop: unlike `prefers-color-scheme` and
  `navigator.languages`, the platform exposes no preferred text size.

#### Accessibility

- The tradeoffs are documented in `docs/accessibility.md` rather than
  glossed: the accessible name now rests entirely on `aria-label`; a
  hand-rolled listbox has weaker assistive-tech support than a native
  `<select>`, which remains the better choice for some audiences; and
  the glyph is font-dependent, though `"A"` is materially safer than a
  pictograph. WCAG 1.4.4 (Resize Text) guidance is retained.
