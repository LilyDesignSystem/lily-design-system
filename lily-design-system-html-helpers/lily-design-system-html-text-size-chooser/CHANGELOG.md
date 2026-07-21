# Changelog — TextSizeChooser (HTML)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

First release under the name
`lily-design-system-html-text-size-chooser`. The version resets to
0.1.0 because this package name has never been published; a renamed
package carries no release history.

### Added

- `<text-size-chooser>` custom element: a headless text-size control.
  It renders an icon button (the letter "A", U+0041) that opens a
  WAI-ARIA APG listbox of sizes. Light DOM only; ships no CSS.
- On each applied size it sets `data-text-size` on `target` (default
  `document.documentElement`), optionally persists to
  `localStorage[storageKey]`, and dispatches a `textsizechange`
  `CustomEvent`. Consumer CSS maps the values to actual sizing.
- Class hooks `text-size-chooser`, `text-size-chooser-button`,
  `text-size-chooser-icon`, `text-size-chooser-list`,
  `text-size-chooser-option`.
- Named exports including `TextSizeChooser`, `sizeName`,
  `nextTextSizeChooserId`; types `TextSizeChooserProps`,
  `TextSizeChooserChangeDetail`.

### Changed

- Renamed from `lily-design-system-html-text-size-select`. The custom
  element is `<text-size-chooser>` (was `<text-size-chooser>`), the
  class is `TextSizeChooser` (was `TextSizeChooser`), and the class
  hooks are `text-size-chooser*` (were `text-size-chooser*`). Behaviour
  is unchanged.

Previously released in-tree as
`lily-design-system-html-text-size-select`; that history is preserved
below and did not ship under the current package name.

---

## Prior history — released in-tree as `lily-design-system-html-text-size-select`

### 0.2.0 — 2026-07-21

#### Changed (BREAKING)

- **No longer a native `<select>`.** This helper is now an icon button
  that opens a WAI-ARIA APG listbox, matching `theme-chooser` and
  `locale-chooser`; it was the last native `<select>` among the helpers.
  Root is `<div class="text-size-chooser">` wrapping a hidden input
  (form participation, carries `name`), a
  `<button class="text-size-chooser-button">` whose only content is an
  `aria-hidden` glyph span, and a
  `<ul class="text-size-chooser-list" role="listbox" hidden>` of
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
  back to a crude bitmap shape — and it means *decrease* rather than
  *size*. A plain in-font letter renders everywhere and stays
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
