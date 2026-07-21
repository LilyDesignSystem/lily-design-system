# Changelog — TextSizeChooser (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

### Added

- Initial release under this name. `TextSizeChooser` is an Angular 20
  headless text-size control: a single-glyph button ("A", U+0041) that
  opens a WAI-ARIA APG listbox of sizes and sets `data-text-size` on the
  document root or a consumer-supplied `target`; consumer CSS maps the
  values to actual sizing. Standalone, signal-based, `OnPush`, `@for`
  control flow, zero CSS.
- Optional `localStorage` persistence via `storageKey`.
- Public surface: `TextSizeChooser` (selector
  `lily-text-size-chooser`), `TextSizeChooserIcon`
  (`ng-template[lilyTextSizeChooserIcon]`), `nextTextSizeChooserId`,
  `sizeName`, `LATIN_CAPITAL_LETTER_A`, and the `ChildArgs` type.
- Class hooks: `.text-size-chooser`, `-button`, `-icon`, `-list`,
  `-option`. Every user-facing string is an input; the glyph is
  `aria-hidden` and the accessible name comes from `label`.

### Renamed

- **Previously released in-tree as
  `lily-design-system-angular-text-size-select`** (last in-tree version
  0.2.0). The package name, directory, component class, selector,
  marker directive and class hooks all changed with it. The version
  resets to 0.1.0 because nothing has ever been published under the new
  name.

The entries below record this package's history under its former name.

---

## Prior history — released in-tree as `lily-design-system-angular-text-size-select`

These entries describe the package before the July 2026 rename. Their
version numbers were never published under the current name.

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
