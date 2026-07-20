# AGENTS — `<locale-select>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless locale select, packaged as the
`<locale-select>` custom element. Applies the chosen locale to the
document root via `lang` and `dir`, with optional `localStorage`
persistence and `navigator.languages` detection. Ships no CSS;
consumer styles the `locale-select` class hook on rendered children.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `locale-select.ts`         | Implementation (TypeScript class).               |
| `locale-select.test.ts`    | Vitest + jsdom spec, one assertion per §7 item.  |
| `locales.ts`               | Built-in code → English-name map and RTL sets.   |
| `locales.tsv`              | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                 | Barrel re-export + side-effectful registration.  |
| `index.md`                 | Human-readable guide.                            |

## Public surface

- Class `LocaleSelect extends HTMLElement` (registered as
  `<locale-select>` on import of `index.ts`).
- Named exports: `LocaleSelect`, `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`.
- Type exports: `LocaleSelectProps`, `LocaleSelectChangeDetail`.

Required attributes: `label`, `locales`. Full table in
[spec/index.md §4.1](./spec/index.md#41-observed-attributes).

## Behaviour contract (one paragraph)

On every locale change the element (1) sets `target.lang` (default
`document.documentElement`) to `bcp47LocaleTag(code)`, (2) optionally
sets `target.dir` to `"rtl"` or `"ltr"` based on `isRtlLocale(code)`,
(3) optionally writes `code` to `localStorage[storageKey]`, and (4)
dispatches a `localechange` `CustomEvent` carrying the
consumer-form code. Initial value resolves from `value` > storage >
navigator match (if `detect-from-navigator` is set) > `default-value`
> `"en"` (if present) > `locales[0]`.

The rendered `<select>` never tracks the selection. Its own DOM
selection stays pinned to the leading placeholder option: on
`change` the handler reads the chosen code, immediately resets
`select.value = ""`, and only then assigns the element's `value`.
The real selection lives on `this.value` (attribute + property) and
everything downstream — `lang` / `dir`, persistence, `localechange`,
navigator detection, initial-value resolution — is unchanged.

## HTML

`<locale-select>` contains one rendered `<select class="locale-select
{class}" aria-label="{label}" name="{name}">` whose first child is
the component-owned placeholder
`<option class="locale-select-option locale-select-placeholder" value="" selected>`
carrying `placeholder ?? label` as its text and **no `lang`**,
followed by one `<option class="locale-select-option" lang="...">`
per locale carrying its locale `value` and visible label text. No
option other than the placeholder is ever marked `selected`.

## Accessibility

- WCAG 2.2 AAA target.
- The native `<select>` provides Arrow / Home / End / typeahead / Tab semantics.
- `aria-label` carries the consumer-supplied accessible name.
- Each locale option carries its own `lang` (WCAG 3.1.2 Language of
  Parts); the placeholder option carries none.
- The document root carries `lang` (WCAG 3.1.1) and (by default)
  `dir` for bidi layout.
- Because the closed control always reads the placeholder, the
  active locale is NOT announced as the combobox value. Consumers
  who need it should surface it in visible text or a polite live
  region — see `docs/accessibility.md`.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM).
- Strict TypeScript on the public surface.
- No runtime dependencies.
- No bundled CSS, fonts, icons, images, or translation files.
- All user-facing strings come from attributes / properties.
- Mirrors the Svelte sibling's §7 acceptance criteria.
