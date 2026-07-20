# Changelog — TextSizeSelect (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a WAI-ARIA APG listbox, matching `theme-select`
  and `locale-select` — all three helpers are now the same shape. The
  root element changes from `<select class="text-size-select">` to
  `<div class="text-size-select">`, containing three children:
  - a hidden `<input type="hidden" name="{name}" value="{value}">`,
    which preserves form participation;
  - a `<button type="button" class="text-size-select-button"
    aria-label="{label}" aria-haspopup="listbox" aria-expanded
    aria-controls="{listId}">` wrapping
    `<span class="text-size-select-icon" aria-hidden="true">A</span>`;
  - a `<ul class="text-size-select-list" role="listbox"
    aria-label="{label}" tabindex="-1" hidden aria-activedescendant>`
    of `<li class="text-size-select-option" role="option" aria-selected
    data-active>`.

  Consumers selecting `select.text-size-select`, reading
  `selectEl.value`, or styling `option.text-size-select-option` must
  migrate. The active size is read from the `v-model:value` binding,
  from `data-text-size` on the target, or from the hidden input.

- **The default slot now replaces the button glyph, not the options.**
  `SlotArgs` changes from
  `{ sizes, value, setSize, name, labelFor }` to
  `{ value, open, labelFor }`. The listbox, its options, the keyboard
  contract, and the apply lifecycle are component-owned and can no
  longer be overridden from the slot. Slot content is decorative: the
  accessible name always comes from `label` via `aria-label`, so slot
  markup should be `aria-hidden="true"` or text-free, and must not be
  interactive (it renders inside the `<button>`).

- **Keyboard interaction is now component-implemented** rather than
  inherited from the platform. Following the APG listbox pattern: on
  the button, `ArrowDown` / `Enter` / `Space` open with the selected
  option active and `ArrowUp` opens with the last option active, and
  opening moves focus to the `<ul>`. On the listbox, `ArrowDown` /
  `ArrowUp` move the active option and **clamp** rather than wrap,
  `Home` / `End` jump to the first / last, `Enter` / `Space` commit and
  refocus the button, `Escape` closes without changing the value, `Tab`
  closes without stealing focus back, and printable characters run a
  typeahead over the option labels with a 500 ms buffer reset. Clicking
  an option selects it; clicking the button again, clicking outside, or
  moving focus out of the root closes the listbox.

### Added

- `sizeName(slug)` — exported label resolver that title-cases each
  hyphen-separated word (`"x-large"` → `"X Large"`). Mirrors
  `themeName(slug)` on theme-select and `localeName(code)` on
  locale-select. The internal `labelFor` now delegates to it, so the
  title-casing rule has exactly one implementation.
- `nextTextSizeSelectId()` — SSR-safe per-instance id generator backed
  by a module counter (never `Math.random()` / `Date.now()`), used for
  the listbox and option ids.
- `LATIN_CAPITAL_LETTER_A` — the default button glyph, `"A"` (U+0041).
  A plain letter rather than a pictograph, deliberately: U+1F5DB
  DECREASE FONT SIZE SYMBOL has no real glyph in common font stacks
  and means *decrease* rather than *size*.
- `type ChildArgs` — alias of `SlotArgs`, matching the canonical
  Svelte helper's type name.
- All of the above are re-exported from the `index.ts` barrel.
- New acceptance clauses §7.14–§7.18 in `spec/index.md` with matching
  tests: the three open keys and the `ArrowUp`-opens-last rule;
  active-descendant movement, clamping, and `Home` / `End`; commit /
  cancel / `Tab` semantics and `aria-activedescendant` teardown;
  typeahead (including wrap-around and modifier-key suppression),
  option clicks, button re-click, and outside-click close; and the
  `sizeName` / `labelFor` delegation rule.
- `docs/accessibility.md` — new in this release; see below.
- `CHANGELOG.md` — this file.

### Unchanged

- The whole downstream lifecycle: `data-text-size` on the target,
  optional `localStorage` persistence, the `change` and `update:value`
  events, `v-model:value`, initial-value resolution (`value` > storage
  > `defaultValue` > `"medium"` > `sizes[0]`), and SSR safety.
- The no-hardcoded-strings i18n rule.

### Not added, deliberately

- **No detection prop.** `theme-select` gained `detectFromSystem` and
  `locale-select` has `detectFromNavigator`, but there is no OS
  "preferred text size" signal exposed to the web — no media query
  equivalent to `prefers-color-scheme`, no `navigator` field. The
  resolution chain is therefore the theme-select chain minus its
  detection step. Recorded in `spec/index.md` §2 and §8 so it is not
  re-proposed as an oversight.

### Accessibility

`docs/accessibility.md` is new and is built around the same three
tradeoffs documented for `theme-select` and `locale-select`:

1. **Icon-only control.** `aria-label` from `label` is the button's
   entire accessible name; a wrong or untranslated `label` leaves it
   unnamed, and WCAG 2.5.3 (Label in Name) has no visible text to
   match against. Noted as sharper here than on the other two helpers:
   the users most likely to need a text-size control are the users
   least well served by a small icon-only target.
2. **A scripted listbox is less robust than a native `<select>`.** No
   platform-native screen reader behaviour, no OS picker on touch
   devices, and uneven real-world `aria-activedescendant` and
   forms-mode support. APG-conformant and keyboard-complete, but a
   genuine robustness regression traded for a compact, consistent,
   styleable control — and the page says plainly that a native
   `<select>` remains the better choice for some audiences, doubly so
   for this helper's audience.
3. **The glyph is font-dependent** — but `"A"` is materially safer
   than a pictograph: it is present in any font that can render the
   page at all, renders in the page's own face, and stays monochrome.
   The residual risk is cosmetic. An SVG recipe for the conventional
   two-size affordance (small A / large A) is included.

The page also keeps this helper's specific WCAG concern, **1.4.4
(Resize Text)**, with the two obligations that come with it: size
typography in relative units or the control does nothing, and test the
layout at the largest size *combined with* 200% browser zoom. It states
that the helper complements browser zoom rather than replacing it, and
that zoom must never be disabled on the strength of shipping it.

A `.text-size-select-status` live-region pattern is documented as the
default, as on the other two helpers: the closed button shows only a
glyph, so the active size has no on-screen and no announced
representation unless the consumer renders one. It has a bonus unique
to this helper — the status text renders at the selected size, so it
doubles as a live preview.

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `TextSizeSelect.vue` — Vue 3 SFC with `<script setup lang="ts">`.
  Rendered `<select aria-label="…" name="…">` with one `<option>` per
  size slug, set `data-text-size="{slug}"` on the resolved target
  element (defaulting to `document.documentElement`), optional
  `storageKey` persistence to `localStorage` with private-mode-safe
  try/catch, two-way binding via `v-model:value`, a `change` event for
  post-apply side effects, and a default scoped slot for custom
  rendering with `{ sizes, value, setSize, name, labelFor }`.
- `index.ts` barrel re-exporting `default`, `TextSizeSelect`, and the
  `Props` + `SlotArgs` types.
- `TextSizeSelect.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7.
- `spec/index.md` — spec-driven contract, version 0.1.0.

### Conventions

- Vue 3 Composition API, `<script setup lang="ts">`.
- Zero runtime dependencies beyond `vue`.
- SSR-safe: all DOM writes inside `onMounted` / `watch`.
- Tested under vitest + jsdom + `@vue/test-utils`.

### Parity

A direct port of the Svelte canonical
`lily-design-system-svelte-text-size-select` v0.1.0.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to the
  `change` Vue event. Use `@change="..."` in templates.
- The `children` snippet from Svelte maps to the default scoped slot
  in Vue.

---

Lily™ and Lily Design System™ are trademarks.
