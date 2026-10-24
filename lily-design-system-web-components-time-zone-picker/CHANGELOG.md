# Changelog — `<lily-time-zone-picker>` (Web Components helper)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.3.0 — 2026-10-16

- Added `open` (property and attribute), `disabled` (property and attribute), an `openchange` event and an `onOpenChange` property, ported from the Svelte package's `open`, `onOpenChange` and `disabled` (spec "Open state and disabled"). `openchange` (detail: the new state) fires once for each change, from the user or from `open`, and not for an initial `open` attribute; opening from outside does not move focus; `disabled` disables the real button inside `<lily-icon-button>` and closes an open popup.

## 0.2.0 — 2026-10-04

**Tooltip (additive, minor).** New `.time-zone-picker-tooltip` element
(`role="tooltip"`, a sibling right after the icon button, `hidden` at rest,
holding the button's `label`) and class hook, shown on pointer hover
(hoverable), on keyboard focus (`:focus-visible`), dismissed by `Escape`,
never shown while the listbox is open. Not linked by `aria-describedby`
(it duplicates `aria-label`). 8 new tests, spec §7.25–§7.30.

**Tooltip Escape works wherever focus is.** While the tooltip is visible a `document` `keydown` listener dismisses it on `Escape` (hover-only tooltips now dismiss, WCAG 1.4.13); removed on hide/disconnect. 2 new tests, spec clause 31.

## 0.1.1 — 2026-09-21

**Internal refactor: the trigger button now composes
`@lilydesignsystem/web-components-headless`'s `<lily-icon-button>`
instead of hand-rolling a `<button>`.** No change to the public API,
rendered markup, or keyboard contract — the full existing test suite
passes unchanged. The listbox stays self-built: this catalog's
`Listbox` custom element is a native-tag-fixed `<lily-listbox>` (no
customized built-ins, by this catalog's own prior architecture
decision — WebKit never implemented them), so it cannot stand in for
the documented `<ul>` the way Svelte's could via `<svelte:element
as="ul">`; composing it would silently change the picker's markup tag,
not just add a class token.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-web-components-time-zone-picker` → `@lilydesignsystem/web-components-time-zone-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-web-components-time-zone-picker`'s last published version (`0.1.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

## 0.1.0 — 2026-09-03

First release under this name. This package is a maintainer-directed
independent copy of the HTML helper of the same picker
(`@lilydesignsystem/html-time-zone-picker`), differing only in the tag it
registers (`<lily-time-zone-picker>` rather than `<time-zone-picker>`) and its package name.
Any entries below are that package's history, inherited so the
reasoning behind the code is not lost; none of them was released under
this name, and a first release is numbered 0.1.0 whatever the tree
carried (see `docs/releasing.md`).

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
`@lilydesignsystem/web-components-time-zone-picker`. The version resets to
0.1.0 because this package name has never been published; a renamed
package carries no release history.

#### Added

- `<lily-time-zone-picker>` custom element: a headless time-zone control.
  It renders an icon button (the letter "A", U+0041) that opens a
  WAI-ARIA APG listbox of sizes. Light DOM only; ships no CSS.
- On each applied size it sets `data-time-zone` on `target` (default
  `document.documentElement`), optionally persists to
  `localStorage[storageKey]`, and dispatches a `textsizechange`
  `CustomEvent`. Consumer CSS maps the values to actual sizing.
- Class hooks `time-zone-picker`, `time-zone-picker-button`,
  `time-zone-picker-icon`, `time-zone-picker-list`,
  `time-zone-picker-option`.
- Named exports including `TimeZonePicker`, `sizeName`,
  `nextTimeZonePickerId`; types `TimeZonePickerProps`,
  `TimeZonePickerChangeDetail`.

#### Changed

- Renamed from `lily-design-system-web-components-time-zone-select`. The custom
  element is `<lily-time-zone-picker>` (was `<lily-time-zone-picker>`), the
  class is `TimeZonePicker` (was `TimeZonePicker`), and the class
  hooks are `time-zone-picker*` (were `time-zone-picker*`). Behaviour
  is unchanged.

Previously released in-tree as
`lily-design-system-web-components-time-zone-select`; that history is preserved
below and did not ship under the current package name.

---

## Prior history — released in-tree as `lily-design-system-web-components-time-zone-select`

### 0.2.0 — 2026-07-21

#### Changed (BREAKING)

- **No longer a native `<select>`.** This helper is now an icon button
  that opens a WAI-ARIA APG listbox, matching `theme-picker` and
  `locale-picker`; it was the last native `<select>` among the helpers.
  Root is `<div class="time-zone-picker">` wrapping a hidden input
  (form participation, carries `name`), a
  `<button class="time-zone-picker-button">` whose only content is an
  `aria-hidden` glyph span, and a
  `<ul class="time-zone-picker-list" role="listbox" hidden>` of
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

- `data-time-zone` application, `localStorage` persistence, `onChange`,
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
