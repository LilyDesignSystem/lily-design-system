# Changelog — TextSizePicker (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.1 — 2026-08-26

Fixed: under zoneless change detection, opening the listbox focused a
still-hidden list — the signal write that removes `hidden` had not
reached the DOM when the focus microtask ran — so focus stayed on the
button and Escape (handled by the list, not the button) could not close
the picker. `ChangeDetectorRef.detectChanges()` now flushes before the
focus, the same fix the date-time-picker port recorded for paging
focus. Invisible to the TestBed suite (whose helpers flush detection);
caught by, and regression-guarded with, the example app's real-browser
Playwright theme-switching spec.

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Pointer-selection close is now part of the contract (2026-07-31)

#### Changed

- **Clicking an option is specified to close the listbox**, not just to
  select and apply. The behaviour was already correct — and is now
  asserted: the pointer test checks `aria-expanded="false"` and the
  list's `hidden` alongside the applied value. Only `Enter` promised the
  close before, and an untested asymmetry is one refactor away from
  becoming real: a selection that leaves `aria-expanded="true"` over a
  hidden list reports an open popup to assistive technology and makes
  every later click miss the options.

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
  `aria-activedescendant` at an id that does not exist.

#### Docs

- `spec/index.md` §7 renumbered so the accessibility-hardening
  clauses land at §7.14–§7.17, matching the canonical Svelte spec;
  the keyboard-contract clauses move to §7.18–§7.22 and the label
  resolver to §7.23.

### Initial entry — 2026-07-21

#### Added

- Initial release under this name. `TextSizePicker` is an Angular 20
  headless text-size control: a single-glyph button ("A", U+0041) that
  opens a WAI-ARIA APG listbox of sizes and sets `data-text-size` on the
  document root or a consumer-supplied `target`; consumer CSS maps the
  values to actual sizing. Standalone, signal-based, `OnPush`, `@for`
  control flow, zero CSS.
- Optional `localStorage` persistence via `storageKey`.
- Public surface: `TextSizePicker` (selector
  `lily-text-size-picker`), `TextSizePickerIcon`
  (`ng-template[lilyTextSizePickerIcon]`), `nextTextSizePickerId`,
  `sizeName`, `LATIN_CAPITAL_LETTER_A`, and the `ChildArgs` type.
- Class hooks: `.text-size-picker`, `-button`, `-icon`, `-list`,
  `-option`. Every user-facing string is an input; the glyph is
  `aria-hidden` and the accessible name comes from `label`.

#### Renamed

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
