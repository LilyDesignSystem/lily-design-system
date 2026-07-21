# CHANGELOG — lily-design-system-react-text-size-chooser

## 0.1.0 — 2026-07-21

Initial release under this name.

`TextSizeChooser` is a headless React 19 text-size control: an icon button
("A", U+0041) that opens a WAI-ARIA APG listbox of size slugs. Choosing one
sets `data-text-size` on the target element, optionally persists to
`localStorage`, and calls `onChange`; the consumer's CSS maps each value to
actual sizing. It ships no CSS; the consumer styles the `text-size-chooser`,
`text-size-chooser-button`, `text-size-chooser-icon`,
`text-size-chooser-list` and `text-size-chooser-option` class hooks. All DOM
writes happen inside `useEffect`, so it is SSR-safe.

Public surface: `TextSizeChooser` (default and named), `sizeName`,
`LATIN_CAPITAL_LETTER_A`, plus the `Props` and `ChildArgs` types. Required
props are `label` and `sizes`.

### Renamed

- Previously released in-tree as
  `lily-design-system-react-text-size-select`. The rename to
  `-text-size-chooser` also renames the `TextSizeChooser` symbol to
  `TextSizeChooser`, the `text-size-chooser*` class hooks to
  `text-size-chooser*`, and the `data-lily-text-size-select*` attributes to
  `data-lily-text-size-chooser*`. It brings the helper into line with the
  catalog-wide `*-chooser` naming and keeps the `-select` suffix reserved
  for components that really are a `<select>`. Nothing was ever published
  under the old name, so the version restarts at `0.1.0` rather than
  continuing the in-tree numbering; the entries below record that earlier
  history.

### Changed (BREAKING — DOM contract and public API)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a dropdown listbox, following the WAI-ARIA APG
  listbox pattern — the shape `theme-chooser` and `locale-chooser` already
  moved to. All three helpers are now structurally identical, so a row
  of Lily™ preference controls in one banner is uniform. The root is a
  `<div class="text-size-chooser {className}">` — rest props spread onto
  that `<div>`, not onto a `<select>` — containing:
  - `<input type="hidden" name="{name}" value="{value}">`, so the
    control still submits with a surrounding form;
  - `<button type="button" class="text-size-chooser-button" aria-label
    aria-haspopup="listbox" aria-expanded aria-controls>` holding
    `<span class="text-size-chooser-icon" aria-hidden="true">A</span>`;
  - `<ul class="text-size-chooser-list" role="listbox" aria-label
    tabindex="-1" hidden>` with one
    `<li class="text-size-chooser-option" role="option" aria-selected>`
    per slug, plus `data-active` on the keyboard-active option and
    `aria-activedescendant` on the list while open.

  Option and list ids come from React's `useId`, so they are stable and
  hydration-safe.
- **The glyph is `"A"` (U+0041 LATIN CAPITAL LETTER A)**, exported from
  `TextSizeChooser.tsx` and the barrel as `LATIN_CAPITAL_LETTER_A`. It is
  a plain letter, not a pictograph, deliberately: U+1F5DB DECREASE FONT
  SIZE SYMBOL has no real glyph in common font stacks — it falls back to
  a crude bitmap shape — and it means *decrease* rather than *size*. "A"
  renders in the page's own font everywhere and stays monochrome like
  theme-chooser's ◑.
- **`titleCaseSize` is renamed `sizeName`.** Same behaviour
  (`"x-large"` → `"X Large"`), harmonised with `themeName` in
  theme-chooser and `localeName` in locale-chooser so all three catalogs
  expose the label rule under a parallel name. The internal `labelFor`
  delegates to it. Update imports; `titleCaseSize` is gone.
- **`children` changed meaning entirely.** It no longer renders the
  `<option>` elements — the component owns the options. It now replaces
  the glyph **inside the button** and receives
  `{ value, open, labelFor }`. The former `sizes`, `setSize`, and `name`
  fields of `ChildArgs` are gone; consumers who drove the selection from
  the render prop should use controlled `value` + `onChange` instead.
- `Props` now extends `HTMLAttributes<HTMLDivElement>` minus `onChange`,
  `children`, and `defaultValue`. `<select>`-only attributes
  (`required`, `disabled`, `form`, …) are no longer part of the surface.

### Added

- A component-implemented keyboard contract, replacing the platform
  semantics the native `<select>` used to supply. On the button:
  `ArrowDown` / `Enter` / `Space` open with the selected option active
  (or the first), `ArrowUp` opens with the last option active, and
  opening moves focus to the listbox. On the listbox: `ArrowDown` /
  `ArrowUp` move the active option and clamp rather than wrap,
  `Home` / `End` jump to the ends, `Enter` / `Space` select and apply
  and close and return focus to the button, `Escape` closes and
  refocuses without changing the value, `Tab` closes without stealing
  focus back, and printable characters run a typeahead over the option
  labels with a 500 ms buffer reset.
- Pointer behaviour: clicking an option selects it; clicking the button
  again, clicking outside the root, or focus leaving the root closes
  without changing the value.
- New class hooks: `text-size-chooser-button`, `text-size-chooser-icon`,
  `text-size-chooser-list`. New attribute hooks for styling:
  `[data-active]` and `[aria-selected]` on the options,
  `[aria-expanded]` on the button, `[hidden]` on the list.
- `docs/accessibility.md`, documenting the roles, the keyboard contract,
  the three tradeoffs this pattern accepts, the status-region pattern,
  and the WCAG 1.4.4 / 1.4.12 obligations specific to a text-size
  control.
- A keyboard test suite mirroring the canonical Svelte one (§7.14–§7.18).

### Unchanged

- The behaviour contract: `data-text-size` on the target, optional
  `localStorage` persistence, `onChange`, initial-value resolution
  (`value` > storage > `defaultValue` > `"medium"` > `sizes[0]`), and
  SSR safety.
- `name` still names the value in a surrounding form — it now rides on
  the hidden input rather than on the `<select>`.
- The no-hardcoded-strings i18n rule: every user-facing string still
  comes from props, and the word "default" is still never emitted.
- **No detection prop was added.** Unlike `theme-chooser`
  (`prefers-color-scheme`) and `locale-chooser` (`navigator.languages`),
  no platform signal exposes a preferred text size, so there is nothing
  to detect.

### Accessibility notes

- The glyph is `aria-hidden`, so `label` is now the **only** accessible
  name the control has. It is not optional.
- A custom listbox does not receive the platform-level assistive-tech
  treatment a native `<select>` gets; `aria-activedescendant` support
  varies across screen reader and browser combinations. A native
  `<select>` remains the better control for some audiences — this
  package traded that away for footprint and cross-helper consistency,
  and `docs/accessibility.md` says so plainly. Manual screen-reader
  passes matter more than they did before.
- The glyph depends on the user's installed fonts, but "A" is the safe
  case: U+0041 exists in every font, unlike the pictograph it replaced
  in the design. Consumers who need certainty can still supply their own
  `children` glyph or an SVG.
- The status-region pattern used by the sibling helpers now applies
  here too: the closed button shows only a glyph and never announces
  the active size. The quick start pairs the control with a visible
  `aria-live="polite"` line.
- WCAG 1.4.4 (Resize Text) guidance is retained and expanded: the
  control must remain operable at every size it offers, and the
  consumer's CSS must scale in relative units for the attribute to mean
  anything.

### Styling

- The package still ships no CSS, which now includes no positioning: the
  listbox renders in normal flow until the consumer supplies the
  `position: relative` / `position: absolute` pair. Open and close are
  driven by the `hidden` attribute.

---

## Prior history — released in-tree as `lily-design-system-react-text-size-select`

The releases below were never published to npm under any name; they are
the in-tree development history of this package before the rename.

### 0.1.0 — 2026-06-05

#### Added

- Initial release: a native `<select>` of text-size slugs that applies
  `data-text-size` to the document root, with optional `localStorage`
  persistence, controlled/uncontrolled `value`, `sizeLabels`, a
  `children` render prop for the options, and SSR safety.

---

Lily™ and Lily Design System™ are trademarks.
