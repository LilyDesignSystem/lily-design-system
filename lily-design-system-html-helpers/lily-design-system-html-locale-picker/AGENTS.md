# AGENTS — `<locale-chooser>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless locale chooser, packaged as the
`<locale-chooser>` custom element. Applies the chosen locale to the
document root via `lang` and `dir`, with optional `localStorage`
persistence and `navigator.languages` detection. Ships no CSS;
consumer styles the `locale-chooser` class hooks on rendered children.

The control is an **icon button that opens a dropdown listbox**
(WAI-ARIA APG listbox pattern), not a native `<select>`.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`            | Specification-driven contract (canonical).       |
| `locale-chooser.ts`         | Implementation (TypeScript class).               |
| `locale-chooser.test.ts`    | Vitest + jsdom spec, one test per §7 clause.     |
| `locales.ts`               | Built-in code → English-name map and RTL sets.   |
| `locales.tsv`              | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                 | Barrel re-export + side-effectful registration.  |
| `index.md`                 | Human-readable guide.                            |
| `docs/custom-rendering.md` | The two subclassing tiers; the only customisation surface. |
| `docs/attributes-reference.md` | Field-by-field attribute / property reference.   |
| `docs/styling.md`          | Class hooks, state hooks, positioning, RTL-safe CSS. |
| `docs/recipes.md`          | Task-shaped snippets.                            |
| `docs/troubleshooting.md`  | Symptom-first fixes.                             |
| `docs/{accessibility,bcp47,concepts,i18n-integration,rtl,ssr}.md` | Topic deep-dives. |

## Public surface

- Class `LocaleChooser extends HTMLElement` (registered as
  `<locale-chooser>` on import of `index.ts`).
- Named exports: `LocaleChooser`, `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`, `nextLocaleChooserId`,
  `GLOBE_WITH_MERIDIANS`.
- Type exports: `LocaleChooserProps`, `LocaleChooserChangeDetail`.
- Instance members beyond the attribute mirrors: `open` (getter),
  `listId` (getter), `optionId(index)`, `openList(startIndex?)`,
  `closeList(refocus = true)`, `labelFor(code)`, `tagFor(locale)`,
  and the overridable `renderButtonContent(): Node`.

Required attributes: `label`, `locales`. Full table in
[spec/index.md §4.1](./spec/index.md#41-observed-attributes). There is
no `placeholder` attribute — it was removed with the native
`<select>` it existed to pin.

## Behaviour contract (one paragraph)

On every locale change the element (1) sets `target.lang` (default
`document.documentElement`) to `bcp47LocaleTag(code)`, (2) optionally
sets `target.dir` to `"rtl"` or `"ltr"` based on `isRtlLocale(code)`,
(3) optionally writes `code` to `localStorage[storageKey]`, and (4)
dispatches a `localechange` `CustomEvent` carrying the consumer-form
code. Initial value resolves from `value` > storage > navigator match
(if `detect-from-navigator` is set) > `default-value` > `"en"` (if
present) > `locales[0]`.

A `value` change never rebuilds the rendered DOM — rebuilding while
the listbox is open would destroy focus and the active descendant, so
it only syncs the state-carrying attributes (hidden input value,
`aria-expanded`, `hidden`, `aria-activedescendant`, per-option
`aria-selected` / `data-active`) and re-applies. Structural
attributes (`locales`, `locale-labels`, `label`, `name`, `class`)
rebuild and close the list first.

## HTML

`<locale-chooser>` renders a `<div class="locale-chooser {class}">`
containing, in order: a `<input type="hidden" name="{name}">` for
form participation; a `<button type="button" class="locale-chooser-button"
aria-label="{label}" aria-haspopup="listbox" aria-expanded
aria-controls="{listId}">` whose content is
`<span class="locale-chooser-icon" aria-hidden="true">` carrying
U+1F310 GLOBE WITH MERIDIANS followed by U+FE0E VARIATION
SELECTOR-15 (VS15 forces the monochrome text presentation); and a
`<ul class="locale-chooser-list" id="{listId}" role="listbox"
aria-label="{label}" tabindex="-1" hidden>` holding one
`<li class="locale-chooser-option" id="{optionId}" role="option"
aria-selected lang="{tag}">` per locale.

`aria-activedescendant` sits on the `<ul>` only while open.
`data-active` marks the keyboard-highlighted option; `aria-selected`
marks the applied one — different things. Ids come from
`nextLocaleChooserId()`, a module-level counter (SSR-safe; no
`Math.random()` / `Date.now()`).

## Keyboard

On the button: `ArrowDown` / `Enter` / `Space` open with the selected
option active (or index 0); `ArrowUp` opens with the last option
active; opening moves focus to the `<ul>`. On the listbox: arrows
move the active option and **clamp** (no wrap); `Home` / `End` jump
to the ends; `Enter` / `Space` select, apply, close, and refocus the
button; `Escape` closes without changing the value; `Tab` closes
without stealing focus back; printable characters run a 500 ms
typeahead over the option labels. Clicking an option selects it;
clicking outside or focus leaving the root closes the list. Full
table: [spec/index.md §4.7](./spec/index.md#47-keyboard-contract).

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- `aria-label` carries the consumer-supplied accessible name on
  **both** the button and the listbox. The glyph is
  `aria-hidden="true"`, so `label` is the only accessible name the
  control has.
- Focus sits on the `<ul>` while open, never on an `<li>`; the active
  option is conveyed by `aria-activedescendant`.
- Each locale option carries its own `lang` (WCAG 3.1.2 Language of
  Parts); **the button and the `<ul>` carry none**.
- The document root carries `lang` (WCAG 3.1.1) and (by default)
  `dir` for bidi layout.
- Three tradeoffs — icon-only naming (and WCAG 2.5.3 Label in Name),
  weaker AT support than a native `<select>` plus no native mobile
  picker, and platform-dependent glyph rendering. Stated in full in
  `docs/accessibility.md`.
- Because the closed button shows only a glyph, the active locale is
  not visible anywhere. Surfacing it in visible text or a polite live
  region is the documented default pattern.

## Custom rendering

Light DOM has no `<slot>`, so subclassing is the only customisation
surface, in two tiers:

- **Tier 1** — override `renderButtonContent(): Node`, the direct
  analogue of the `children` snippet / render prop the other
  frameworks pass. `this.value`, `this.open`, and `this.labelFor(...)`
  stand in for `ChildArgs`. The base class keeps the aria wiring and
  the keyboard contract. **Recommend this path.**
- **Tier 2** — post-process after `super.connectedCallback()`. The
  subclass takes over the whole accessibility and keyboard contract.

See [`docs/custom-rendering.md`](./docs/custom-rendering.md) for the
invariants a tier-2 subclass must preserve.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM).
- Strict TypeScript on the public surface.
- No runtime dependencies.
- No bundled CSS, fonts, icons, images, or translation files — which
  is why the dropdown ships without positioning and the glyph is a
  bare Unicode codepoint.
- All user-facing strings come from attributes / properties.
- Mirrors the Svelte sibling's §7 acceptance criteria.
