# Changelog — LocaleChooser (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

Renamed from `lily-design-system-vue-locale-select`, alongside its three
sibling helpers, so the catalog reads consistently and the `*-select`
names stay with the Lily catalog components. Nothing was ever published
under the old name, so the version resets to 0.1.0 rather than
continuing the in-tree 0.4.0.

The rename is full-depth:

- Component and default export: `LocaleSelect` -> `LocaleChooser`.
- Class hooks: `.locale-select*` -> `.locale-chooser`,
  `.locale-chooser-button`, `.locale-chooser-icon`,
  `.locale-chooser-list`, `.locale-chooser-option`.
- Data attributes: `data-lily-locale-select*` ->
  `data-lily-locale-chooser*`.
- Id helper: `nextLocaleSelectId` -> `nextLocaleChooserId`.

`localeName` keeps its name -- it never said "select".

### The package as it stands

- Headless Vue 3 locale chooser: an icon button (U+1F310 GLOBE WITH
  MERIDIANS) that opens a WAI-ARIA APG listbox of locale codes.
- Applies the chosen locale to the target element as `lang` (BCP 47,
  hyphenated) and `dir` (`ltr` / `rtl`, auto-detected per script). It
  does not translate anything.
- Optional `localStorage` persistence; optional `navigator.languages`
  first-visit detection.
- Exports `LocaleChooser`, `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `nextLocaleChooserId`, `GLOBE_WITH_MERIDIANS`,
  `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`, and
  the `Props` / `SlotArgs` / `ChildArgs` types.
- Ships no CSS, fonts, icons, or images. SSR-safe.

## Prior history (as `lily-design-system-vue-locale-select`)

Everything below happened in-tree under the former name, and is
kept verbatim -- headings demoted one level, old names intact -- so
the record stays accurate. None of it was published to npm.

### Unreleased

#### Changed

- **Default button glyph gains U+FE0E VARIATION SELECTOR-15**:
  `GLOBE_WITH_MERIDIANS` is now `"\u{1F310}\uFE0E"`. VS15 requests text
  presentation; without it browsers select the colour-emoji font and
  the globe renders blue, which did not match theme-select's
  monochrome ◑ — the two controls sit together in a page header and
  should read as one set. Verified in Chromium. Consumers asserting on
  the glyph must expect the two-codepoint sequence.
- Examples renamed from the radio-group era to descriptive names
  matching theme-select's convention — none of them had rendered
  radios, a select, or a button group since the icon-button rewrite:
  `01-radios` → `basic`, `02-select` → `custom-rendering`,
  `03-buttons` → `script-aware-glyph`, `04-rtl-demo` → `rtl-demo`,
  `05-nhs-style` → `nhs-style`, `06-with-vue-i18n` → `with-vue-i18n`,
  `07-with-paraglide` → `with-paraglide`, `08-ssr-cookie` →
  `ssr-cookie`, `09-scoped-target` → `scoped-target`, `10-combobox` →
  `combobox`. All inbound links updated.

#### Added

- Five docs bringing the file shape level with theme-select, written
  for locale-select rather than ported: `docs/props-reference.md`,
  `docs/styling.md`, `docs/custom-rendering.md`, `docs/recipes.md`,
  `docs/troubleshooting.md`. The topic-specific docs (`bcp47`,
  `concepts`, `i18n-integration`, `rtl`) stay as they are; there is
  deliberately no locale counterpart to theme-select's `preloading`,
  which is about stylesheet preloading.

#### Fixed

- CHANGELOG had two entries both labelled 0.2.0. The 2026-06-15 entry
  described the same `<select>` migration that shipped in the
  2026-07-03 0.2.0 release; it is merged into that entry with its
  in-tree date noted.
- `spec/index.md` claimed "Spec version: 0.1.0" despite 0.2.0 and
  0.3.0 having shipped; now 0.3.0.

#### Changed (BREAKING)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a WAI-ARIA APG listbox. The root element is a
  `<div class="locale-select {class}">` containing a hidden
  `<input type="hidden" name="{name}" value="{value}">` for form
  participation, a `<button type="button" class="locale-select-button"
  aria-label="{label}" aria-haspopup="listbox" aria-expanded
  aria-controls="{listId}">` wrapping
  `<span class="locale-select-icon" aria-hidden="true">🌐</span>`, and a
  `<ul class="locale-select-list" role="listbox" aria-label="{label}"
  tabindex="-1" hidden aria-activedescendant>` of
  `<li class="locale-select-option" role="option" aria-selected
  data-active lang="{bcp47}">`.

  Motivation: a `<select>` grows to fit its longest option, and the
  built-in table has 436 of them. The icon button costs one glyph of
  width no matter how many locales you support, and the listbox is
  ordinary DOM, so consumer CSS owns every pixel of it.

  Migration notes:
  - Code that queried `select.locale-select` must now query
    `div.locale-select`, `button.locale-select-button`, or
    `ul.locale-select-list`. `$attrs` still falls through to the root,
    which is now the `<div>`; `class` still lands on the root.
  - Options are `<li role="option">`, not `<option>`. Positional
    indexing no longer needs to skip a leading placeholder.
  - Reading the active locale from the DOM means reading the hidden
    input, the `aria-selected="true"` option, or `lang` on the target
    — the same places as before, minus the `<select>`'s own value.
  - CSS targeting `.locale-select` as a form control (`field-sizing`,
    `appearance`, and friends) no longer applies; restyle against the
    button and list hooks.

- **The `placeholder` prop is removed.** It existed only to pin the
  `<select>`'s displayed value, and there is no `<select>` left to
  pin. The `locale-select-placeholder` class hook is gone with it.
  `label` now names **both** the button and the listbox, and — because
  the button is icon-only — it is the button's **only** accessible
  name.

- **The default slot now replaces the button glyph, not the options.**
  `SlotArgs` changes from
  `{ locales, value, setLocale, name, labelFor, tagFor, isRtl }` to
  `{ value, open, labelFor }`. The listbox, the option markup, the
  keyboard contract, and the apply lifecycle are all component-owned.
  Consumers who used the slot to render a button group or a custom
  `<select>` should render that markup alongside the component and
  bind both to the same value. Slot content is decorative and should
  be `aria-hidden="true"` or text-free, since `label` supplies the
  accessible name.

- **`name` is now the hidden input's name**, not a `<select>`'s.

#### Added

- Keyboard contract implemented per the WAI-ARIA APG listbox pattern.
  On the button: `ArrowDown` / `Enter` / `Space` open with the
  selected option active, `ArrowUp` opens with the last option active,
  and opening moves focus to the `<ul>`. On the listbox:
  `ArrowDown` / `ArrowUp` move the active option and **clamp** rather
  than wrap, `Home` / `End` jump to the ends, `Enter` / `Space`
  commit, `Escape` cancels without changing the value, `Tab` closes
  without stealing focus back, and printable characters run a
  typeahead over the labels with a 500 ms buffer reset. Clicking an
  option commits it; clicking outside or moving focus out of the root
  closes the listbox.
- `nextLocaleSelectId()` — a module-counter id generator, exported so
  the element ids are stable and SSR-safe (never `Math.random()` or
  `Date.now()`).
- `GLOBE_WITH_MERIDIANS` — the default button glyph, U+1F310
  (`&#127760;`) followed by U+FE0E VARIATION SELECTOR-15; see the
  glyph note under **Changed** above.
- `ChildArgs` — exported alias of `SlotArgs`, matching the canonical
  Svelte helper's type name.
- Acceptance clauses §7.24–§7.27 in `spec/index.md` covering the
  keyboard contract, with matching tests; §7.1–§7.6 rewritten for the
  new markup contract.

#### Unchanged

- `lang` / `dir` application, RTL auto-detection, `applyDir`,
  `target`, `localeLabels`, `localStorage` persistence,
  `navigator.languages` detection, the `change` and `update:value`
  events, `v-model:value`, initial-value resolution order, SSR
  safety, and every exported pure helper (`bcp47LocaleTag`,
  `isRtlLocale`, `localeName`, `matchNavigatorLanguage`,
  `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`).
- **Per-option `lang` survives the rewrite.** Each
  `<li role="option">` still carries its locale's BCP 47 tag, so
  endonyms are still pronounced in their own language (WCAG 3.1.2) —
  and more reliably than before, since some OS-native select popups
  ignore `lang` on `<option>` entirely.

#### Changed (examples & docs)

- `docs/accessibility.md` rewritten around the three tradeoffs the
  new shape actually carries: the icon-only button's accessible name
  rests entirely on `label` (with a particular irony for a *language*
  picker, whose own name is written in one language); a scripted
  listbox has weaker, less uniform assistive-technology support than
  the native `<select>` it replaced, with no OS picker on mobile; and
  the 🌐 glyph renders however the user's fonts render it, up to and
  including tofu. The 0.3.0 placeholder-pinning tradeoff is gone from
  the docs along with the placeholder.
- The `.locale-select-status` live-region guidance is **kept**, and is
  arguably more necessary now: the closed control shows only a glyph,
  so the active locale has no on-screen or announced representation at
  all. The reasoning for keeping it visible rather than `sr-only`, for
  `aria-live="polite"` over `role="alert"`, and for wrapping endonyms
  in `<span :lang="bcp47LocaleTag(locale)">` is unchanged.
- Examples 02, 03, 05, and 10 rewritten for the new slot contract;
  `examples/README.md`, `index.md`, `AGENTS.md`, `AGENTS/*.md`, and
  `docs/{concepts,rtl,ssr}.md` updated to match.

### 0.3.0 — 2026-07-20

#### Changed (BREAKING)

- **The closed `<select>` now always reads a placeholder word rather
  than the active locale name.** Two DOM-contract changes follow:
  - A component-owned placeholder `<option class="locale-select-option
    locale-select-placeholder" value="" selected>` is rendered as the
    **first child** of the `<select>`, in both the default and the
    custom-slot code paths. Option count is now `locales.length + 1`,
    the first option's value is `""`, and it carries no `lang`
    attribute. Tests and CSS that assume one option per locale, or
    that index options positionally, must shift by one.
  - The `<select>` element's own `value` **no longer tracks the
    selection**. On `change` the component reads the chosen code,
    resets `select.value = ""`, then applies the code. Code reading
    `selectEl.value` to learn the active locale must read the
    `v-model:value` binding or `lang` on the target instead.

  Motivation: the control now stays as narrow as the placeholder word
  instead of growing to fit the longest locale name — which matters
  for the 436-entry built-in locale table.

  Accessibility tradeoff, documented in `docs/accessibility.md`: a
  screen-reader user no longer hears the active locale announced as
  the combobox value. Consumers who need that should surface the
  active selection in visible text or a polite live region.

#### Added

- `placeholder` prop (optional `string`, defaults to the value of
  `label`) — the text of the placeholder option. Keeps the package
  i18n-clean: no hardcoded user-facing string is ever emitted.
- Acceptance clauses §7.24–§7.26 in `spec/index.md` with matching
  tests: the placeholder renders the label text and holds the
  select's value at `""` while the locale is still applied; the
  `placeholder` prop overrides the label; choosing an option applies
  it and snaps the select back to the placeholder.

#### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the entry-point example and the `index.md` quick-start both
  ship a visible `<p class="locale-select-status" aria-live="polite">`
  showing the active locale via the exported `localeName`.
  `aria-live="polite"` announces mutations only, so it stays silent on
  first paint and speaks on each change. `docs/accessibility.md`
  reframes opting *out* as the deliberate choice and keeps an explicit
  "what this does and does not fix" note — the region announces
  transitions, it does not restore combobox value semantics.

### 0.2.0 — 2026-07-03

#### Changed (BREAKING)

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

#### Changed

- **Root markup migrated to a native `<select>`.** (Landed in-tree
  2026-06-15; released as part of this version.) The root element
  is now `<select class="locale-select" aria-label="…" name="…">`
  with one `<option class="locale-select-option" value="…" lang="…">`
  per locale code, replacing the previous grouped-control markup.
  The `<select>` carries the implicit `combobox` role and provides
  Arrow / Home / End / typeahead semantics natively, so the select
  scales to long locale lists and pops the OS-native picker on
  mobile. Each `<option>` keeps its `lang` attribute for WCAG 3.1.2
  (Language of Parts) pronunciation. The previous per-option label
  span is removed; the label text now sits directly inside the
  `<option>`, and the implicit selected-option state replaces the old
  grouped-control selection state. The default scoped slot's
  `SlotArgs` are unchanged.

#### Unchanged

- The behaviour contract: DOM application (`lang` / `dir`), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

### 0.1.0 — 2026-06-05

Initial release.

#### Added

- `LocaleSelect.vue` — Vue 3 SFC with `<script setup lang="ts">`.
  Implements the full Svelte canonical contract:
  - Renders `<select aria-label="…" name="…">` with one
    `<option lang="{tagFor(locale)}">` per locale code per WCAG 3.1.2
    (Language of Parts).
  - Sets `lang="{bcp47LocaleTag(code)}"` on the resolved target
    element (defaults to `document.documentElement`).
  - Sets `dir="rtl"` / `dir="ltr"` on the target element via
    `isRtlLocale()` auto-detection. Opt-out via `:apply-dir="false"`.
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Optional `detectFromNavigator` first-visit fallback via
    `navigator.languages`.
  - Two-way binding via `v-model:value`.
  - `change` event for post-apply side effects.
  - Default scoped slot for custom rendering with
    `{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`.
- `locales.ts` — 436-row built-in locale-code → English-name table
  plus RTL language and script subtag sets. Byte-identical to the
  Svelte canonical helper (framework-agnostic data).
- `locales.tsv` — canonical source for `locales.ts`. Byte-identical
  to the Svelte canonical helper.
- `index.ts` barrel re-exporting `default`, `LocaleSelect`,
  `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`, and the `Props` +
  `SlotArgs` types.
- `LocaleSelect.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7 (23 items).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `bcp47.md`, `concepts.md`, `i18n-integration.md`, `rtl.md`,
  `ssr.md`.
- `examples/` subdirectory: `01-radios.vue`, `02-select.vue`,
  `03-buttons.vue`, `04-rtl-demo.vue`, `05-nhs-style.vue`,
  `06-with-vue-i18n.vue`, `07-with-paraglide.vue`,
  `08-ssr-cookie.vue`, `09-scoped-target.vue`, `10-combobox.vue`,
  plus a `README.md` index.

#### Conventions

- Vue 3 Composition API, `<script setup lang="ts">`.
- Zero runtime dependencies beyond `vue`.
- SSR-safe: all DOM writes inside `onMounted` / `watch`.
- Tested under vitest + jsdom + `@vue/test-utils`.

#### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-select` v0.1.0. The DOM contract,
BCP 47 normalisation rules, RTL detection sets, initial-value
resolution order, and apply order match clause-for-clause.

#### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `change` Vue event. Use `@change="..."` in templates.
- The `children` snippet from Svelte maps to the default scoped
  slot in Vue. Slot args are camelCase in TypeScript, kebab-case in
  template attribute bindings (e.g. `set-locale`, `label-for`,
  `tag-for`, `is-rtl`).
- The bindable model name is `value`, not the Vue 3 default
  `modelValue`. Use `v-model:value="locale"` and not
  `v-model="locale"`.
- `target` accepts an `HTMLElement` or `null`; templates pass a
  `ref` directly (`:target="panelRef"`) since `useTemplateRef` /
  `ref()` round-trip the DOM node automatically once mounted.
