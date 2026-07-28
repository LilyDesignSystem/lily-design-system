# Changelog — TextSizePicker (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

### Changed (BREAKING)

- Renamed from `lily-design-system-svelte-text-size-select`. Directory,
  component (`TextSizePicker.svelte`), exported symbols
  (`TextSizePicker`, `nextTextSizePickerId`) and class hooks
  (`text-size-picker`, `text-size-picker-button`,
  `text-size-picker-icon`, `text-size-picker-list`,
  `text-size-picker-option`) all carry the new name.
- A headless Svelte 5 text-size picker: an icon button that opens a
  WAI-ARIA APG listbox of text-size slugs and sets
  `data-text-size="{slug}"` on a target element (default
  `document.documentElement`). Optional `localStorage` persistence.
  Ships no CSS — the consumer maps each slug to real typography.

### Versioning

- Version reset to `0.1.0`. Nothing has been published under the name
  `lily-design-system-svelte-text-size-picker`, so continuing the old
  number line would imply releases that never existed under this name.

---

## Prior history — released in-tree as `lily-design-system-svelte-text-size-select`

Previously released in-tree as `lily-design-system-svelte-text-size-select`. Everything below happened
under that name. Identifiers in these entries (class hooks, symbols, data
attributes) have been updated to their current spellings so the document
reads coherently; the events they describe are unchanged.

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
