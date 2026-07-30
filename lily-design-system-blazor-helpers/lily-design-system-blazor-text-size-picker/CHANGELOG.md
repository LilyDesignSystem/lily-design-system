# Changelog — TextSizePicker (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Accessibility hardening (2026-07-29/30)

#### Changed

- **`Tab` from the open list is documented — and deliberately NOT given
  the canonical Svelte button-refocus.** The canonical fix moves focus
  to the trigger before hiding the list, because Svelte hides
  synchronously, ahead of the browser's default Tab, which otherwise
  restarts from the top of the document. Blazor cannot reproduce that
  bug — the default Tab always runs before the async handler, so it
  proceeds from the still-visible list — and mirroring the refocus
  would run *after* the default Tab and yank the user back to the
  trigger they just left. Both implementations end with focus on the
  tab stop after the picker; the divergence is recorded in spec §5.6.
- **Typeahead follows the APG single-character rule** (canonical
  §7.15). A single character advances to the *next* matching option,
  and repeating that character cycles through the matches; only a
  buffer of differing characters refines the match anchored on the
  active option. Previously a character that matched the active option
  went nowhere.

#### Added

- **`PageUp` / `PageDown`** move the active option by ten, clamped —
  an APG-optional key for long lists (canonical §7.16).
- Internal `ButtonReferenceId` / `ListReferenceId` test seams
  (InternalsVisibleTo), so the bUnit suite can compare recorded
  `FocusAsync` interop targets the way the DateTimePicker suite does.

#### Fixed

- Opening with an empty option list no longer refuses to open (and, as
  in the canonical fix, never points `aria-activedescendant` at an id
  that does not exist): the active index is `-1` and the attribute is
  simply absent (canonical §7.17).

#### Docs

- `spec/index.md`, `index.md` and `AGENTS.md` still called the control
  a "text-size select" in a few places — the same native-`<select>`-era
  drift the canonical package fixed; all now say "picker" and document
  the icon-button + APG-listbox contract.

### Initial entry — 2026-07-21

Renamed from `lily-design-system-blazor-text-size-select` to
`lily-design-system-blazor-text-size-picker`. The NuGet package is now
`LilyDesignSystem.Blazor.TextSizePicker`.

The rename is the whole change: no behaviour, no API semantics and no
DOM structure moved. This release ships the code exactly as it stood
under the old name, including everything previously listed as
Unreleased there.

Renamed in this package:

- Component and context: `TextSizePicker` -> `TextSizePicker`,
  `TextSizeSelectContext` -> `TextSizePickerContext`.
- Class hooks: `.text-size-picker*` -> `.text-size-picker*`.
- Generated element ids: `text-size-picker-{n}` ->
  `text-size-picker-{n}`.
- Files: `TextSizePicker.razor{,.cs}` -> `TextSizePicker.razor{,.cs}`,
  `TextSizeSelectTests.cs` -> `TextSizePickerTests.cs`.

The applied attribute stays `data-text-size`, and `sizeName` and every
parameter name are unchanged — they never said "select".

**Version reset to 0.1.0.** Nothing has ever been published under the
new package id, so a `0.2.0` here would imply releases that never
existed. The history below belongs to `lily-design-system-blazor-text-size-select`
and is kept for provenance.

Upgrading: rename the package reference, the component tag, and the CSS
selectors. Nothing else moves.

---

## Prior history — released in-tree as `lily-design-system-blazor-text-size-select`

#### 0.2.0 — 2026-07-21

##### Changed (BREAKING)

- **The control is no longer a native `<select>`.** It is now an **icon
  button that opens a dropdown listbox**, built to the WAI-ARIA APG
  listbox pattern, matching `ThemePicker` and `LocalePicker` so all
  three helpers are one shape:

  ```html
  <div class="text-size-picker {CssClass}">
    <input type="hidden" name="{Name}" value="{Value}" />
    <button
      type="button"
      class="text-size-picker-button"
      aria-label="{Label}"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-controls="{listId}"
    >
      <span class="text-size-picker-icon" aria-hidden="true">A</span>
    </button>
    <ul
      class="text-size-picker-list"
      id="{listId}"
      role="listbox"
      aria-label="{Label}"
      tabindex="-1"
      hidden
      aria-activedescendant="{active option id, only while open}"
    >
      <li
        class="text-size-picker-option"
        id="{optionId}"
        role="option"
        aria-selected="true|false"
        data-active
      >
        Medium
      </li>
    </ul>
  </div>
  ```

- **The button glyph is `"A"` (U+0041 LATIN CAPITAL LETTER A).** A
  letter, not a pictograph. U+1F5DB DECREASE FONT SIZE SYMBOL was the
  first choice but has no real glyph in common font stacks — it falls
  back to a crude bitmap shape — and it means _decrease_ rather than
  _size_. `"A"` renders in the page's own font everywhere, stays
  monochrome like `◑`, and is the conventional text-size affordance.
- **`ChildContent` changes meaning.** It now **replaces the glyph inside
  the button** and receives a narrowed context of
  `{ Value, Open, LabelFor }`. It no longer renders options — those are
  component-owned, so the listbox semantics cannot be broken by a
  consumer override. `TextSizePickerContext` drops `Sizes`, `SetSize`
  and `Name`; imperative selection is now `SetSizeAsync` via a `@ref`.
- **`CssClass` and `AdditionalAttributes` now land on the root `<div>`**,
  not on a form control. `Name` moves to the hidden `<input>`.
- Consumers must update any CSS or test selector targeting
  `select.text-size-picker` or `option.text-size-picker-option`.
- **`TitleCase` is replaced by the public `SizeName`.** The new rule no
  longer strips the word "default" from a slug: `"default-large"` now
  renders as `"Default Large"`, not `"Large"`. This harmonises with
  `ThemePicker.ThemeName` and `Locales.LocaleName`, which never had the
  special case — and with the canonical Svelte `sizeName`, which does
  not have it either. Supply a `SizeLabels` entry if you relied on the
  old stripping.

##### Added

- The full APG listbox keyboard contract, implemented by the component
  rather than inherited from the browser: `ArrowDown` / `Enter` /
  `Space` open on the selected option and `ArrowUp` opens on the last;
  arrows move and **clamp** (no wrapping); `Home` / `End` jump;
  `Enter` / `Space` select-apply-close-and-refocus; `Escape` closes
  without changing the value; `Tab` closes without stealing focus;
  printable characters run a 500 ms typeahead over the labels. Clicking
  an option selects it; focus leaving the root closes.
- Focus management via `ElementReference.FocusAsync()`, deferred to
  `OnAfterRenderAsync` because the `<ul>` cannot take focus while it
  still carries `hidden`.
- **`TextSizePicker.SizeName(string slug)` — public static.** The single
  implementation of the default label rule (`"x-large"` -> `"X Large"`).
  The private instance `LabelFor` delegates to it, so there is exactly
  one copy of the rule; `SizeLabels` still overrides.
- **`TextSizePicker.LatinCapitalLetterA`** — the public glyph constant.
- Stable, SSR-safe element ids from a monotonic process-wide counter
  (`text-size-picker-{n}`) — no randomness and no clock reads.
- A hidden `<input>` preserving `Name` / `Value` form participation.
- `docs/accessibility.md` and `docs/styling.md`, plus an `examples/`
  set (`Basic`, `Persistence`, `CustomLabels`, `CustomRendering`,
  `ExternalButtons`), matching the other two helpers.

##### Not added, deliberately

- **No `DetectFromSystem` parameter.** ThemePicker detects
  `prefers-color-scheme` and LocalePicker detects `navigator.languages`,
  but there is no OS "preferred text size" signal to detect — no media
  query equivalent exists. Users who scale text at the OS level are
  already served by browser zoom and the browser's own
  minimum-font-size, which this helper must not fight.

##### Unchanged

- `data-text-size` application on the document root, `localStorage`
  persistence, `OnChange` / `ValueChanged`, the initial-value resolution
  order (`Value` > storage > `DefaultValue` > `"medium"` > `Sizes[0]`),
  and SSR / prerender safety.

##### Notes

- The status-region pattern stays the recommendation, but for a
  different reason: the selection _is_ now readable off the control
  (one option carries `aria-selected="true"`), so the status region
  compensates for the closed button being a bare glyph rather than for
  missing semantics.
- `docs/accessibility.md` states the three tradeoffs of this shape
  plainly — the accessible name rests entirely on `aria-label`; a
  hand-rolled listbox has weaker assistive-technology support than a
  native `<select>` (which remains the better control for some
  audiences); and the glyph is font-dependent, though `"A"` is
  materially safer than a pictograph there. The WCAG 1.4.4 (Resize
  Text) guidance specific to this helper is retained and expanded.
- Two clauses of the canonical Svelte contract could not be ported
  faithfully to Blazor, exactly as for the other two helpers: no
  `preventDefault` on keydown (Blazor evaluates it at render time and so
  cannot spare `Tab`; a suppress-next-click flag stops `Enter` /
  `Space` double-toggling), and no document-level click listener (this
  package ships no JavaScript; the root's `focusout` closes instead).
  Both are recorded in `spec/index.md §5.6` and in
  `docs/accessibility.md`.
- Test count for this helper goes from 12 to 23 `[Fact]`s, one per
  `spec/index.md §7` clause; the catalog suite goes from 77 to 88.

#### 0.1.0 — 2026-06-17

##### Added

- Initial release: a headless Blazor text-size select rendering a native
  `<select>` of size slugs, applying `data-text-size` to the document
  root, with optional `localStorage` persistence, `@bind-Value`
  two-way binding, `SizeLabels` overrides, and SSR / prerender safety.

---

Lily™ and Lily Design System™ are trademarks.
