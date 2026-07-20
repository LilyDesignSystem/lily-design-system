# Changelog — `<locale-select>` (HTML helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- **The control is no longer a native `<select>`.** It is now an
  **icon button that opens a dropdown listbox**, implementing the
  WAI-ARIA APG listbox pattern. The rendered root is a
  `<div class="locale-select {class}">` containing a hidden
  `<input>`, a `<button class="locale-select-button">` whose content
  defaults to `<span class="locale-select-icon" aria-hidden="true">`
  carrying U+1F310 GLOBE WITH MERIDIANS, and a
  `<ul class="locale-select-list" role="listbox" tabindex="-1"
  hidden>` with one `<li class="locale-select-option" role="option"
  aria-selected lang="{tag}">` per locale.
- **`placeholder` is REMOVED** — attribute, property, and the
  `locale-select-placeholder` class hook. It was a 0.3.0 mechanism
  for pinning a native `<select>`'s displayed text; there is no
  `<select>` left to pin. The "closed control always reads the
  placeholder word" tradeoff is gone with it.
- **Class hooks changed.** Added: `locale-select-button`,
  `locale-select-icon`, `locale-select-list`. Removed:
  `locale-select-placeholder`. `locale-select` now names the `<div>`
  root (was the `<select>`); `locale-select-option` now names an
  `<li>` (was an `<option>`).
- **Consumers must now supply positioning CSS.** The package ships
  no CSS, so the `<ul>` renders in normal flow until the root gets
  `position: relative` and the list `position: absolute`. Without it
  the dropdown pushes page content around every time it opens. All
  examples carry the minimum block; `examples/02-styling.html` is
  the reference.
- **New keyboard contract**, implemented in JS rather than inherited
  from the platform. Button: `ArrowDown` / `Enter` / `Space` open
  with the selected option active, `ArrowUp` opens with the last
  option active, and opening moves focus to the `<ul>`. List: arrows
  move the active option and **clamp** (no wrapping), `Home` / `End`
  jump to the ends, `Enter` / `Space` select and return focus to the
  button, `Escape` closes without changing the value, `Tab` closes
  without stealing focus back, and printable characters run a 500 ms
  typeahead over the option labels. Clicking outside the root, or
  focus leaving it, closes the list.
- **Reactivity change**: a `value` change no longer rebuilds the
  rendered DOM. Rebuilding while the listbox is open would destroy
  focus and the active descendant, so `value` only syncs the
  state-carrying attributes and re-applies. Structural attributes
  (`locales`, `locale-labels`, `label`, `name`, `class`) still
  rebuild, and close the list first.
- **Accessibility tradeoffs changed shape.** Three now apply, and
  they are documented in full in `docs/accessibility.md`: the
  control is icon-only, so `label` is the only accessible name it
  has and WCAG 2.5.3 Label in Name needs a visible label of the
  consumer's own; a hand-rolled listbox has weaker and more variable
  assistive-technology support than the native `<select>` it
  replaced and gets no native mobile picker; and the Unicode glyph
  renders as colour emoji, a monochrome glyph, or tofu depending on
  platform fonts. The compensating status region is more useful than
  before, not less — the closed button shows only a glyph.

### Added

- **The default glyph gains U+FE0E VARIATION SELECTOR-15.**
  `GLOBE_WITH_MERIDIANS` is now `"\u{1F310}\uFE0E"` (two codepoints,
  was one). VS15 requests the *text* presentation; without it
  browsers select the colour-emoji font and the globe renders blue,
  which did not match theme-select's monochrome ◑. Verified in
  Chromium. Consumers comparing against the constant are unaffected;
  consumers hardcoding `"\u{1F310}"` in an equality check should
  import the constant instead.
- `renderButtonContent(): Node` — the overridable rendering hook,
  and this framework's stand-in for the `children` snippet / render
  prop / `ChildContent` the other Lily helpers accept. Whatever it
  returns replaces the default glyph inside the button; `this.value`,
  `this.open`, and `this.labelFor(...)` stand in for `ChildArgs`, and
  the hook re-runs on every structural rebuild *and* every state sync
  (a `value` change, each open and close) so derived content tracks
  state the same way a reactive snippet would. The
  base class keeps the aria wiring and the whole keyboard contract,
  making this the only customisation path that cannot break
  accessibility. Note it re-runs on structural rebuilds only, not on
  a bare `value` change.
- Public listbox surface on the class: `open` (getter), `listId`
  (getter), `optionId(index)`, `openList(startIndex?)`,
  `closeList(refocus = true)`, plus `labelFor(code)` and
  `tagFor(locale)` promoted from private.
- New exports from `index.ts`: `GLOBE_WITH_MERIDIANS` (the default
  button glyph) and `nextLocaleSelectId()` (the module-level id
  counter behind `listId` / `optionId`, deterministic and SSR-safe —
  no `Math.random()` or `Date.now()`).
- `data-active` on the keyboard-highlighted option, distinct from
  `aria-selected` on the applied one, and `aria-activedescendant` on
  the `<ul>` while open.
- A hidden `<input type="hidden" name="{name}">` inside the rendered
  root, preserving form participation now that there is no
  `<select>`.
- `docs/custom-rendering.md` — the two subclassing tiers, the
  `renderButtonContent()` recipes (SVG icon, visible text for WCAG
  2.5.3, live-updating button label), and the eight invariants a
  tier-2 subclass must preserve.

### Unchanged

- Every attribute except `placeholder`; the `localechange`
  `CustomEvent` (same `{ locale }` detail, still `bubbles: true,
  composed: true`); `lang` / `dir` application; BCP 47 normalisation;
  RTL detection; `localStorage` persistence; navigator detection;
  initial-value resolution; the exported pure helpers; per-option
  `lang` for WCAG 3.1.2; and SSR safety.

### Renamed (examples)

- `examples/01-default.html` → `examples/01-basic.html`, matching
  theme-select's `01-basic.html` so the two helpers offer the same
  entry-point example under the same name. Inbound links in
  `examples/README.md` and `docs/accessibility.md` updated.
- `examples/01-radios.html` → `examples/01-default.html`.
- `examples/02-select.html` → `examples/02-styling.html`.

The last two were named for rendering models the element no longer
uses. (`03-buttons.html` keeps its name: it is a tier-2 subclass that
really does render a button group.)

### Added (docs)

Docs brought to parity with theme-select, so the two helpers offer
the same file shape. Written for locale-select rather than
copy-pasted:

- `docs/attributes-reference.md` — field-by-field reference for every
  attribute and property, including the inverted `apply-dir` boolean
  and the four-step label fall-through.
- `docs/styling.md` — the five class hooks, the
  `[data-active]` vs `[aria-selected]` distinction, the `hidden`
  trap, per-script font tuning keyed off the `lang` each option
  carries, and why logical properties are mandatory in a control that
  writes `dir` to its own container.
- `docs/recipes.md` — task-shaped snippets: server-side
  `Accept-Language` negotiation reusing the exported
  `matchNavigatorLanguage`, cookie persistence, endonym labels,
  scoped `target` preview, cross-tab sync.
- `docs/troubleshooting.md` — symptom-first fixes, including the
  RTL-positioning failure unique to this control.

theme-select's topic-specific docs (`preloading.md`) have no locale
counterpart and were not invented; locale-select's
(`bcp47.md`, `rtl.md`, `concepts.md`, `i18n-integration.md`) stay.

## 0.3.0 — 2026-07-20

### Changed (BREAKING)

- The closed `<select>` now always reads a placeholder word instead
  of the active locale name, so the control stays as narrow as that
  word. The element renders a component-owned placeholder
  `<option class="locale-select-option locale-select-placeholder" value="" selected>`
  as the first child of the `<select>`, before the real options and
  before any consumer-supplied custom option rendering. The
  placeholder carries no `lang` — it is not a locale.
- **DOM contract change**: the `<select>` now has
  `locales.length + 1` options (was `locales.length`), and the
  option `value` list is `["", ...locales]` (was `locales`).
  Per-option `lang` assertions shift by one index.
- **DOM contract change**: the rendered `<select>`'s own `value` is
  always `""` and no longer tracks the selection. On `change` the
  element reads the chosen code, snaps `select.value` back to `""`,
  and assigns the host's `value`. Read the selection from
  `el.value` or the `localechange` detail — never from the rendered
  `<select>`.
- **Accessibility tradeoff**: a screen-reader user no longer hears
  the active locale announced as the combobox value. Consumers who
  need it should surface the active locale in visible text or a
  polite live region — see `docs/accessibility.md`. The target's
  `lang` / `dir` are still written, so AT pronunciation is
  unaffected.

### Added

- `placeholder` attribute / property (optional, string). Text of the
  placeholder option; defaults to `label`, keeping the package free
  of hardcoded user-facing strings. Observed, so changing it
  re-renders.
- `index.md` documents the `.locale-select-placeholder` class hook
  and a `field-sizing: content` / `max-width` width recipe.

### Unchanged

- `value` remains the real selection; `lang` / `dir` application,
  `localStorage` persistence, navigator detection, the
  `localechange` event, and initial-value resolution all behave
  exactly as before.

### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the entry-point example and the `index.md` quick-start both
  ship a visible `<p class="locale-select-status" aria-live="polite">`
  showing the active locale via the exported `localeName`.
  `aria-live="polite"` announces mutations only, so it stays silent on
  first paint and speaks on each change. `docs/accessibility.md`
  reframes opting *out* as the deliberate choice and keeps an explicit
  "what this does and does not fix" note — the region announces
  transitions, it does not restore combobox value semantics.

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="locale-select">` with one `<option class="locale-select-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `locale-select` now names the `<select>` root
  and `locale-select-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

### Unchanged

- The behaviour contract: DOM application (`lang` / `dir`), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

## 0.1.0 — 2026-06-05

Initial release. Ported from the Svelte canonical
`lily-design-system-svelte-locale-select`. The DOM contract,
behaviour, and acceptance criteria match the canonical clause-for-
clause.

### Added

- `<locale-select>` custom element extending `HTMLElement`.
- Side-effectful registration in `index.ts`, guarded by
  `customElements.get("locale-select")` for idempotence.
- Required attributes: `label`, `locales` (CSV).
- Optional attributes: `value`, `default-value`, `storage-key`,
  `detect-from-navigator`, `name`, `apply-dir`, `locale-labels`
  (JSON), `class`.
- Mirroring JS properties for every observed attribute.
- `el.locales`: `string[]` getter / setter — CSV-encoded in the
  attribute.
- `el.localeLabels`: `Record<string, string>` getter / setter —
  JSON-encoded in the attribute.
- `el.target`: `HTMLElement | null` — JS-only (no attribute form).
- `localechange` `CustomEvent` (`bubbles: true, composed: true`)
  with `detail: { locale: string }`.
- Pure exports: `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`.
- Reference exports: `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`,
  `RTL_SCRIPT_SUBTAGS`.
- Type exports: `LocaleSelectProps`, `LocaleSelectChangeDetail`.
- Built-in 436-row English-name table (`locales.ts`, sourced from
  `locales.tsv`).
- Acceptance criteria in `spec/index.md` §7; one vitest test per clause
  in `locale-select.test.ts`.
- Documentation: `docs/concepts.md`, `docs/accessibility.md`,
  `docs/bcp47.md`, `docs/rtl.md`, `docs/ssr.md`,
  `docs/i18n-integration.md`.
- Examples: 10 self-contained `.html` files under `examples/`
  covering the default `<select>`, custom `<select>` styling,
  buttons, RTL, NHS-style banner, FormatJS, native `Intl.*`, SSR
  cookie pre-seed, scoped target, and combobox.

### Conventions

- Light DOM rendering — no Shadow DOM.
- One rendered `<select class="locale-select {class}"
  aria-label="{label}" name="{name}">` per select.
- Each `<option>` carries its own `lang` for WCAG 3.1.2 (Language of
  Parts) pronunciation hints.
- `<html lang="{tag}">` (BCP 47 hyphen form) on
  `el.target ?? document.documentElement` on every successful
  apply.
- `<html dir="{ltr|rtl}">` written by default; suppressed when
  `apply-dir="false"`.
- `localStorage` persistence opt-in via `storage-key`; read / write
  errors silently swallowed.
- Navigator detection opt-in via `detect-from-navigator`; simple
  exact-then-language match, not RFC 4647 best-fit.
- Initial value resolves from
  `value > localStorage > navigator > default-value > "en" >
  locales[0]`.

### Spelling note

The HTML catalog uses `bcp47LocaleTag` (American style, no
hyphenated capitalisation) to match DOM-API convention. The Svelte
canonical uses `bcp47LocaleTag` too — both packages agree on this
one. Other helper names mirror the Svelte canonical exactly:
`isRtlLocale`, `localeName`, `matchNavigatorLanguage`.

### Subclassing for custom rendering

Custom rendering happens by extending the `LocaleSelect` class and
overriding `connectedCallback` / `attributeChangedCallback`
(private methods cannot be overridden). The base class keeps
owning the lifecycle (`lang` / `dir` writes, `localStorage`,
`localechange` event).

> Superseded: the Unreleased entry above adds
> `renderButtonContent()` as a safer tier-1 hook, and the current
> guide is [`docs/custom-rendering.md`](./docs/custom-rendering.md).
> Examples [03-buttons.html](./examples/03-buttons.html),
> [05-nhs-style.html](./examples/05-nhs-style.html), and
> [10-combobox.html](./examples/10-combobox.html) remain the
> post-processing (tier-2) demonstrations.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.3.0]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
