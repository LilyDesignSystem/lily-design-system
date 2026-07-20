# Changelog — `<locale-select>` (HTML helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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
`localechange` event). See `docs/concepts.md` and examples
[02-select.html](./examples/02-select.html),
[03-buttons.html](./examples/03-buttons.html),
[05-nhs-style.html](./examples/05-nhs-style.html), and
[10-combobox.html](./examples/10-combobox.html).

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.3.0]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
