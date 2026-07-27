# Changelog — `<theme-chooser>` (HTML helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

First release under the name `lily-design-system-html-theme-chooser`.
The version resets to 0.1.0 because this package name has never been
published; a renamed package carries no release history.

### Added

- `<theme-chooser>` custom element: a headless, runtime theme-CSS
  loader. It renders an icon button (◑, U+25D1, exported as
  `CIRCLE_WITH_RIGHT_HALF_BLACK`) that opens a WAI-ARIA APG listbox of
  themes. Light DOM only; ships no CSS.
- On each applied theme it sets the `href` of one managed
  `<link rel="stylesheet" data-lily-theme-chooser="{name}">` in
  `document.head`, sets `data-theme` on `target` (default
  `document.documentElement`), optionally persists to
  `localStorage[storageKey]`, and dispatches a `themechange`
  `CustomEvent`.
- Observed attributes `label`, `themes-url`, `themes`, `value`,
  `default-value`, `storage-key`, `detect-from-system`, `name`,
  `extension`, `theme-labels`, `class`, each with a mirrored property.
- Class hooks `theme-chooser`, `theme-chooser-button`,
  `theme-chooser-icon`, `theme-chooser-list`, `theme-chooser-option`.
- Named exports `ThemeChooser`, `themeName`, `matchSystemTheme`,
  `normalizeThemesUrl`, `themeHref`, `nextThemeChooserId`,
  `CIRCLE_WITH_RIGHT_HALF_BLACK`; types `ThemeChooserProps`,
  `ThemeChooserChangeDetail`.

### Changed

- Renamed from `lily-design-system-html-theme-select`. The custom
  element is `<theme-chooser>` (was `<theme-chooser>`), the class is
  `ThemeChooser` (was `ThemeChooser`), the class hooks are
  `theme-chooser*` (were `theme-chooser*`), and the managed link's
  attribute is `data-lily-theme-chooser` (was
  `data-lily-theme-select`). The rename removes the collision with the
  Lily catalog component of the same old name. Behaviour is unchanged.

Previously released in-tree as `lily-design-system-html-theme-select`;
that history is preserved below and did not ship under the current
package name.

---

## Prior history — released in-tree as `lily-design-system-html-theme-select`

### Unreleased

#### Changed (BREAKING)

- **`<theme-chooser>` is no longer a native `<select>`.** It now
  renders an **icon button that opens a dropdown listbox**, following
  the WAI-ARIA APG listbox pattern. The rendered root is a
  `<div class="theme-chooser {class}">` containing a hidden
  `<input>`, a `<button class="theme-chooser-button">` with
  `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls`, and a
  `<ul class="theme-chooser-list" role="listbox">` with one
  `<li class="theme-chooser-option" role="option">` per theme. Light
  DOM as before.
- **The `placeholder` attribute / property is REMOVED.** It existed
  in 0.3.0 only to pin the displayed text of the native `<select>`;
  there is no `<select>` left to pin. The
  `theme-chooser-placeholder` class hook is removed with it, as is
  the "closed control always reads the placeholder word" tradeoff.
- **Class-hook contract changed.** `theme-chooser` now names the root
  `<div>`. Added: `theme-chooser-button`, `theme-chooser-icon`,
  `theme-chooser-list`. Kept: `theme-chooser-option` (now on an
  `<li>`, not an `<option>`). Removed: `theme-chooser-placeholder`.
  New state selectors: `[data-active]` for the
  keyboard-highlighted option and `[aria-selected]` for the chosen
  one — they are different things and should be styled differently.
- **Consumers must now supply positioning CSS.** The package still
  ships no CSS, and that now includes the dropdown: the `<ul>`
  renders in normal flow and pushes content down until the consumer
  gives the root `position: relative` and the list
  `position: absolute`. A `display` rule on `.theme-chooser-list`
  also overrides the UA `[hidden] { display: none }`, so it must be
  re-asserted or scoped with `:not([hidden])`. Worked example in
  `docs/styling.md`.
- **New keyboard contract**, implemented in JS rather than inherited
  from the platform. Button: `ArrowDown` / `Enter` / `Space` open on
  the selected option, `ArrowUp` opens on the last. List (which
  holds focus while open): arrows move the active option and clamp
  without wrapping, `Home` / `End` jump to the ends, `Enter` /
  `Space` select and return focus to the button, `Escape` closes
  without changing the value, `Tab` closes without stealing focus,
  and printable characters run a typeahead over the option labels
  with a 500 ms buffer. Clicking outside the root, or focus leaving
  it, closes the list.
- **Focus model changed.** Focus sits on the `<ul>` while open, never
  on an `<li>`; the highlighted option is conveyed by
  `aria-activedescendant`, present only while open. Consumer CSS
  must style `.theme-chooser-option[data-active]` — `:focus` never
  matches an option — and `.theme-chooser-list:focus-visible`.
- **Form participation moved to a hidden `<input>`.** A listbox is
  not a form control, so `name` now lands on
  `<input type="hidden">`. It still doubles as the managed
  `<link data-lily-theme-chooser="{name}">` discriminator.
- **Accessibility tradeoffs changed.** The old placeholder tradeoff
  is gone. Three new ones replace it, documented in
  `spec/index.md` §6.5 and `docs/accessibility.md`: the control is
  icon-only, so `aria-label` is the entire accessible name and the
  control fails WCAG 2.5.3 Label in Name without a consumer-supplied
  visible label; a hand-rolled APG listbox has weaker and more
  variable AT support than a native `<select>` and gets no mobile OS
  picker; and the button's Unicode glyph renders differently per
  platform (no font is bundled) and can come out as tofu.

#### Added

- **`themeName(theme)` — exported label resolver.** Title-cases each
  hyphen-separated word of a slug (`"high-contrast"` →
  `"High Contrast"`). This is the mirror of locale-chooser's
  `localeName(code)`; examples across the catalogs had been
  hand-duplicating the rule. `labelFor()` now delegates to it, so
  there is exactly one implementation. Exported from
  `theme-chooser.ts` and the `index.ts` barrel.
- **`detect-from-system` — system colour-scheme detection.** New
  boolean observed attribute with a mirrored `el.detectFromSystem`
  property, following the same convention as locale-chooser's
  `detect-from-navigator` (absent → false; present → true;
  `="false"` → false). When set, and only when `value` is empty and
  storage is empty, the initial theme is resolved from
  `prefers-color-scheme`.
- **`matchSystemTheme(themes)` — exported pure helper.** The mirror
  of `matchNavigatorLanguage(navLangs, locales)`. Reads
  `matchMedia("(prefers-color-scheme: dark)")` and maps it to the
  `"dark"` / `"light"` slug. Returns `""` when that slug is not in
  `themes`, **or when `matchMedia` is unavailable** — the SSR case,
  and also jsdom, which does not implement it either.
- Initial-value resolution now reads
  `value > storage > detection > default-value > "light" > themes[0]`,
  placing detection in the same slot navigator detection occupies for
  locale-chooser. An explicit `value` and a stored past choice both
  still outrank the OS preference.
- `renderButtonContent(): Node` — the overridable rendering hook,
  and this framework's stand-in for the `children` snippet / render
  prop / slot the Svelte, React, and Vue siblings expose. Whatever
  `Node` it returns replaces the default glyph inside the button;
  `this.value`, `this.open`, and `this.labelFor(...)` stand in for
  the `ChildArgs` the other frameworks pass, and the hook re-runs on
  every structural rebuild *and* every state sync (a `value` change,
  each open and close) so derived content tracks state the same way
  a reactive snippet would. The base class keeps
  building the button and listbox, so all the aria wiring and the
  whole keyboard contract survive. This is the recommended
  customisation path — the only one that cannot break accessibility.
- Public listbox API: `get open()`, `get listId()`,
  `optionId(index)`, `openList(startIndex?)`, and
  `closeList(refocus = true)`.
- `labelFor(code)` is now public (was the private `#labelFor`), so
  status regions and subclasses can resolve a slug to its display
  label with `theme-labels` applied.
- `CIRCLE_WITH_RIGHT_HALF_BLACK` — the default button glyph, U+25D1
  (`&#9681;`), exported from `theme-chooser.ts` and `index.ts`.
- `nextThemeChooserId()` — the module-level id counter behind
  `listId` / `optionId`, exported. Ids are stable and SSR-safe: no
  `Math.random()`, no `Date.now()`.
- `docs/styling.md` documents the new hooks, the `[data-active]` vs
  `[aria-selected]` distinction, the positioning requirement, the
  `[hidden]` trap, and a complete worked example.
- `docs/custom-rendering.md` rewritten around the two customisation
  tiers, with the invariants a structure-replacing subclass must
  preserve.
- Examples 1 and 9 now ship the minimum dropdown CSS; example 9
  demonstrates `renderButtonContent()` with an inline SVG and with a
  glyph-plus-theme-name button.

#### Unchanged

- Every other attribute, the `themechange` `CustomEvent` (same
  detail shape, still `bubbles: true, composed: true`), the managed
  `<link>` swap, `data-theme` application, `localStorage`
  persistence, initial-value resolution, SSR safety, the
  no-hardcoded-strings i18n rule, and the pure helpers
  `normalizeThemesUrl` / `themeHref`.
- The sibling `<text-size-chooser>` keeps its native `<select>` and
  is unaffected by this change.

### 0.3.0 — 2026-07-20

#### Changed (BREAKING)

- The closed `<select>` now always reads a placeholder word instead
  of the active theme name, so the control stays as narrow as that
  word. The element renders a component-owned placeholder
  `<option class="theme-chooser-option theme-chooser-placeholder" value="" selected>`
  as the first child of the `<select>`, before the real options and
  before any consumer-supplied custom option rendering.
- **DOM contract change**: the `<select>` now has
  `themes.length + 1` options (was `themes.length`), and the option
  `value` list is `["", ...themes]` (was `themes`).
- **DOM contract change**: the rendered `<select>`'s own `value` is
  always `""` and no longer tracks the selection. On `change` the
  element reads the chosen slug, snaps `select.value` back to `""`,
  and assigns the host's `value`. Read the selection from
  `el.value` or the `themechange` detail — never from the rendered
  `<select>`.
- **Accessibility tradeoff**: a screen-reader user no longer hears
  the active theme announced as the combobox value. Consumers who
  need it should surface the active theme in visible text or a
  polite live region — see `docs/accessibility.md`.

#### Added

- `placeholder` attribute / property (optional, string). Text of the
  placeholder option; defaults to `label`, keeping the package free
  of hardcoded user-facing strings. Observed, so changing it
  re-renders.
- `docs/styling.md` documents the `.theme-chooser-placeholder` class
  hook and a `field-sizing: content` / `max-width` width recipe.

#### Unchanged

- `value` remains the real selection; `data-theme` application, the
  managed `<link>` href swap, `localStorage` persistence, the
  `themechange` event, and initial-value resolution all behave
  exactly as before.

#### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the basic example and the `index.md` quick-start both ship
  a visible `<p class="theme-chooser-status" aria-live="polite">` showing
  the active theme. `aria-live="polite"` announces mutations only, so it
  stays silent on first paint and speaks on each change.
  `docs/accessibility.md` reframes opting *out* as the deliberate choice
  and keeps an explicit "what this does and does not fix" note — the
  region announces transitions, it does not restore combobox value
  semantics.

### 0.2.0 — 2026-07-03

#### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="theme-chooser">` with one `<option class="theme-chooser-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `theme-chooser` now names the `<select>` root
  and `theme-chooser-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

#### Unchanged

- The behaviour contract: DOM application (`data-theme` + managed `<link>` swap), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

### 0.1.0 — 2026-06-05

Initial release. Ported from the Svelte canonical
`lily-design-system-svelte-theme-chooser`. The DOM contract,
behaviour, and acceptance criteria match the canonical clause-for-
clause.

#### Added

- `<theme-chooser>` custom element extending `HTMLElement`.
- Side-effectful registration in `index.ts`, guarded by
  `customElements.get("theme-chooser")` for idempotence.
- Required attributes: `label`, `themes-url`, `themes` (CSV).
- Optional attributes: `value`, `default-value`, `storage-key`,
  `name`, `extension`, `theme-labels` (JSON), `class`.
- Mirroring JS properties for every observed attribute.
- `el.themes`: `string[]` getter / setter — CSV-encoded in the
  attribute.
- `el.themeLabels`: `Record<string, string>` getter / setter —
  JSON-encoded in the attribute.
- `el.target`: `HTMLElement | null` — JS-only (no attribute form).
- `themechange` `CustomEvent` (`bubbles: true, composed: true`)
  with `detail: { theme: string }`.
- Pure exports: `normalizeThemesUrl`, `themeHref`.
- Type exports: `ThemeChooserProps`, `ThemeChooserChangeDetail`.
- 13 acceptance criteria in `spec/index.md` §7; one vitest test per
  clause in `theme-chooser.test.ts`.

#### Conventions

- Light DOM rendering — no Shadow DOM.
- One managed `<link rel="stylesheet" data-lily-theme-chooser="{name}">`
  per select; reused across theme changes, garbage-collected when
  no select with the same `name` remains in the document.
- `data-theme="{slug}"` on `el.target ?? document.documentElement`
  on every successful apply.
- `localStorage` persistence opt-in via `storage-key`;
  read/write errors silently swallowed.
- Initial value resolves from
  `value > localStorage > default-value > "light" > themes[0]`.

#### Spelling note

The HTML catalog uses `normalizeThemesUrl` (American `z`) to match
DOM-API convention. The Svelte canonical uses `normaliseThemesUrl`
(British `s`). Consumers porting between frameworks rename the
import.

#### Subclassing for custom rendering

Custom rendering happens by extending the `ThemeChooser` class and
overriding `connectedCallback` / `attributeChangedCallback` (private
methods cannot be overridden). The base class keeps owning the
lifecycle (managed `<link>`, `data-theme` write, `themechange`
event). See `docs/custom-rendering.md`.

(Superseded in Unreleased: `renderButtonContent()` is now the
supported hook for custom button content.)

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.3.0]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
