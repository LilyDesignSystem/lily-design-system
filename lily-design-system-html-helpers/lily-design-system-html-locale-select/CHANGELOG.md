# Changelog — `<locale-select>` (HTML helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
