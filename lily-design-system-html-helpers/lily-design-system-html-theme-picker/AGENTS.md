# AGENTS — `<theme-chooser>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless theme chooser, packaged as the
`<theme-chooser>` custom element. **Loads theme CSS files dynamically
at runtime** from a developer-supplied directory URL. The control is
an **icon button that opens a dropdown listbox** (WAI-ARIA APG
listbox pattern) — not a native `<select>`. Ships no CSS; the
consumer styles the `theme-chooser` class hooks on the rendered
children, and must supply the list's positioning.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `theme-chooser.ts`          | Implementation (TypeScript class).               |
| `theme-chooser.test.ts`     | Vitest + jsdom spec, one assertion per §7 item.  |
| `index.ts`                 | Barrel re-export + side-effectful registration.  |
| `index.md`                 | Human-readable guide.                            |

## Public surface

- Class `ThemeChooser extends HTMLElement` (registered as
  `<theme-chooser>` on import of `index.ts`).
- Named exports: `ThemeChooser`, `themeName`, `matchSystemTheme`,
  `normalizeThemesUrl`, `themeHref`, `nextThemeChooserId`,
  `CIRCLE_WITH_RIGHT_HALF_BLACK`. `themeName` and `matchSystemTheme`
  are the mirrors of locale-chooser's `localeName` and
  `matchNavigatorLanguage`.
- Type exports: `ThemeChooserProps`, `ThemeChooserChangeDetail`.
- Instance members beyond the attribute mirrors: `open` (getter),
  `listId` (getter), `optionId(index)`, `openList(startIndex?)`,
  `closeList(refocus = true)`, `labelFor(slug)`, and
  `renderButtonContent()` — the overridable rendering hook.

Required attributes: `label`, `themes-url`, `themes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-observed-attributes).
There is no `placeholder` attribute; it was removed with the native
`<select>`.

## Behaviour contract (one paragraph)

On every theme change the element (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-chooser="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to
`document.documentElement`), (3) optionally writes the slug to
`localStorage[storageKey]`, and (4) dispatches a `themechange`
`CustomEvent`. Initial value resolves from `value` > storage >
system detection (if `detect-from-system` is set) > `default-value` >
`"light"` (if present) > `themes[0]` — the same shape locale-chooser
uses, with `detect-from-navigator` in the detection slot.

The real selection lives on `this.value` (attribute + property);
consumers read it from there or from the `themechange` detail. A
`value` change syncs state attributes in place rather than
rebuilding the DOM, because a rebuild while the listbox is open
would destroy focus and the active descendant.

## HTML

`<theme-chooser>` contains one rendered
`<div class="theme-chooser {class}">` holding, in order: a hidden
`<input name="{name}">` for form participation; a
`<button type="button" class="theme-chooser-button" aria-label="{label}"
aria-haspopup="listbox" aria-expanded aria-controls="{listId}">`
whose content defaults to
`<span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>`
(U+25D1, exported as `CIRCLE_WITH_RIGHT_HALF_BLACK`); and a
`<ul class="theme-chooser-list" id="{listId}" role="listbox"
aria-label="{label}" tabindex="-1" hidden>` with one
`<li class="theme-chooser-option" role="option" aria-selected>` per
slug. `aria-activedescendant` sits on the `<ul>` only while open;
`data-active` marks the keyboard-highlighted option, which is a
different thing from `aria-selected`. Full markup:
[spec/index.md §4.5](./spec/index.md#45-dom-contract).

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- The keyboard contract is implemented in JS, not inherited from
  the platform. Button: `ArrowDown`/`Enter`/`Space` open,
  `ArrowUp` opens on the last option. List: arrows move and clamp,
  `Home`/`End` jump, `Enter`/`Space` select and refocus the button,
  `Escape` closes without changing the value, `Tab` closes without
  stealing focus, printable characters run a 500 ms typeahead.
  Table: [spec/index.md §6.2](./spec/index.md#62-keyboard-contract).
- Focus sits on the `<ul>` while open, never on an `<li>`; the
  highlighted option is conveyed by `aria-activedescendant`.
- `aria-label` carries the consumer-supplied accessible name on both
  the button and the list. The glyph is `aria-hidden="true"`.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.
- Three known tradeoffs — icon-only naming (and WCAG 2.5.3), a
  custom listbox being weaker than a native `<select>` in AT, and
  platform-dependent glyph rendering — are recorded in
  [spec/index.md §6.5](./spec/index.md#65-known-tradeoffs) and
  `docs/accessibility.md`. The closed button shows only a glyph, so
  consumers should surface the active theme in visible text or a
  polite live region.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM).
- Strict TypeScript on the public surface.
- No runtime dependencies.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from attributes / properties.
- Mirrors the Svelte sibling's §7 acceptance criteria.
