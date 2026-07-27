# AGENTS — LocaleChooser (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Vue 3 headless locale chooser that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-chooser` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `LocaleChooser.vue`         | Implementation. `<script setup lang="ts">`.      |
| `LocaleChooser.test.ts`     | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`               | Built-in code → English-name map and RTL sets.   |
| `locales.tsv`              | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | Human-readable guide.                            |
| `docs/`                    | Topic guides: a11y, BCP 47, concepts, i18n, RTL, SSR, props, styling, custom rendering, recipes, troubleshooting. |
| `examples/`                | Self-contained Vue 3 examples, descriptively named. |

## Public surface

- Default export: `LocaleChooser` component.
- Named exports: `LocaleChooser`, `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `matchNavigatorLanguage`, `nextLocaleChooserId`,
  `GLOBE_WITH_MERIDIANS`, `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`,
  `RTL_SCRIPT_SUBTAGS`.
- Type exports: `Props`, `SlotArgs`, `ChildArgs` (alias of `SlotArgs`).

Required props: `label`, `locales`. Full table in
[spec/index.md §4.1](./spec/index.md#41-props). There is no
`placeholder` prop — it was removed with the `<select>`.

## Behaviour contract (one paragraph)

On every locale change the chooser (1) sets `target.lang` to the
BCP 47 hyphen form of the code, (2) sets `target.dir` to `"rtl"` /
`"ltr"` (skipped if `applyDir=false`), (3) optionally writes to
`localStorage[storageKey]`, and (4) emits the `change` event with the
consumer-form code. SSR-safe — all DOM writes happen inside
`onMounted` / `watch`. Initial value resolves from `value` > storage >
navigator detection (if enabled) > `defaultValue` > `"en"` (if
present) > `locales[0]`. The control is an icon button that opens a
listbox; the selection lives in `value` / `v-model:value`, in the
hidden input, and in `lang` / `dir` on the target.

## HTML

A root `<div class="locale-chooser {class}">` (`$attrs` falls through
to it) containing three things: a hidden `<input type="hidden"
name="{name}" value="{value}">` for form participation; a
`<button type="button" class="locale-chooser-button" aria-label="{label}"
aria-haspopup="listbox" aria-expanded aria-controls="{listId}">`
wrapping `<span class="locale-chooser-icon" aria-hidden="true">🌐</span>`;
and a `<ul class="locale-chooser-list" role="listbox" aria-label="{label}"
tabindex="-1" hidden aria-activedescendant>` of
`<li class="locale-chooser-option" role="option" aria-selected
data-active lang="{tagFor(locale)}">`. The glyph is U+1F310 GLOBE WITH
MERIDIANS, exported as `GLOBE_WITH_MERIDIANS`. Each option keeps its
own `lang` so its name is pronounced in its own language; the button
and the list carry none. The default scoped slot replaces the
**button glyph** — not the options — and receives
`{ value, open, labelFor }`.

## Accessibility

- WCAG 2.2 AAA target. WCAG 3.1.1 (Language of Page) and 3.1.2
  (Language of Parts).
- The component implements the WAI-ARIA APG listbox keyboard contract
  itself: Arrow keys (clamping, no wrap), Home / End, Enter / Space to
  commit, Escape to cancel, Tab to close, printable-character typeahead
  with a 500 ms buffer. Focus moves to the `<ul>` on open and returns to
  the button on commit or cancel.
- The button is icon-only, so `aria-label` is its **only** accessible
  name; the glyph is `aria-hidden="true"`. The same `label` also names
  the listbox.
- Because the closed control shows only a glyph, the documented pattern
  pairs the chooser with a consumer-rendered `.locale-chooser-status`
  live region. See [docs/accessibility.md](./docs/accessibility.md).

## Conventions this package follows

- Vue 3 `<script setup lang="ts">` Composition API.
- `defineProps`, `defineEmits` for props / events.
- `ref`, `watch`, `onMounted` for state and lifecycle.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `vue`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
