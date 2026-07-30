# LocalePicker (Vue helper)

A reusable, headless Vue 3 locale picker — an icon button that opens
a WAI-ARIA APG listbox — that applies the chosen locale to the
document root via `lang` and `dir`, with optional `localStorage`
persistence and `navigator.languages` detection.

For the full contract see [spec/index.md](./spec/index.md) — it is the single
source of truth for the API, behaviour, and tests. For topic
deep-dives see [docs/](./docs/) and for working code see
[examples/](./examples/).

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [The control](#the-control)
- [BCP 47 normalisation](#bcp-47-normalisation)
- [RTL auto-detection](#rtl-auto-detection)
- [Examples](#examples)
- [Built-in locale data](#built-in-locale-data)
- [Props](#props)
- [Events](#events)
- [Accessibility](#accessibility)
- [SSR](#ssr)
- [Files in this directory](#files-in-this-directory)
- [Documentation](#documentation)
- [Examples directory](#examples-directory)

## Install

This directory is published as a folder-style import; consumers
either copy it into their project or wire it as a workspace
dependency. The only runtime dependency is `vue` ≥ 3.

```ts
import LocalePicker from "./lily-design-system-vue-locale-picker/LocalePicker.vue";
```

Or via the barrel (recommended; gives you the typed helpers too):

```ts
import LocalePicker, {
  bcp47LocaleTag,
  isRtlLocale,
  localeName,
  matchNavigatorLanguage,
  defaultLocaleLabels,
  GLOBE_WITH_MERIDIANS,
  type Props,
  type SlotArgs,
} from "./lily-design-system-vue-locale-picker";
```

## Quick start

Render the picker with a `label` and the list of locales your app
supports. The control is a globe button; activating it opens a
listbox of the locales. The picker writes `lang` and `dir` onto
`<html>` so your i18n library, your CSS (`html[dir="rtl"]`), and
assistive technology all see the change.

```vue
<script setup lang="ts">
import { ref } from "vue";
import LocalePicker, {
  localeName,
} from "./lily-design-system-vue-locale-picker/LocalePicker.vue";

const locale = ref("");
</script>

<template>
  <LocalePicker
    label="Language"
    :locales="['en', 'en_US', 'fr', 'fr_CA', 'ar', 'he']"
    v-model:value="locale"
    storage-key="lily-locale"
    detect-from-navigator
  />

  <p class="locale-picker-status" aria-live="polite">
    Current language: {{ localeName(locale) }}
  </p>
</template>
```

The status line is part of the quick start on purpose. The closed
control is a bare glyph — it never reads "French" — so the status
region is the only channel that reports the active locale, on screen
or to a screen reader. It is visible by default (sighted and
cognitive-accessibility users benefit too), and `aria-live="polite"`
means it stays silent on first paint and speaks once per change.
Opting out is a deliberate decision, not the default; see
[`docs/accessibility.md`](./docs/accessibility.md) for the full
tradeoff and the visually-hidden variant.

When the user picks `ar`, the component:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- emits `update:value` (driving `v-model:value`),
- emits `change` with the new code.

The picker does NOT translate strings — that is the consumer's i18n
library (e.g. `vue-i18n`, Tolgee, Paraglide, raw `Intl.*`). Wire
the bindable `value` or the `change` event to your library so it
loads the right messages.

## The control

The rendered markup is a root `<div>` holding three things: a hidden
input for form participation, an icon button, and a listbox.

```html
<div class="locale-picker">
  <input type="hidden" name="locale" value="en" />
  <button
    type="button"
    class="locale-picker-button"
    aria-label="Language"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="locale-picker-1-list"
  >
    <span class="locale-picker-icon" aria-hidden="true">🌐</span>
  </button>
  <ul
    class="locale-picker-list"
    id="locale-picker-1-list"
    role="listbox"
    aria-label="Language"
    tabindex="-1"
    hidden
  >
    <li
      class="locale-picker-option"
      id="locale-picker-1-option-0"
      role="option"
      aria-selected="true"
      data-active
      lang="en"
    >
      English
    </li>
    <li
      class="locale-picker-option"
      id="locale-picker-1-option-1"
      role="option"
      aria-selected="false"
      lang="cy"
    >
      Welsh
    </li>
  </ul>
</div>
```

Points worth knowing:

- **The button is icon-only.** The glyph is 🌐 (U+1F310 GLOBE WITH
  MERIDIANS), exported as `GLOBE_WITH_MERIDIANS`, and it is
  `aria-hidden="true"` — so `label` is the button's _entire_
  accessible name. The same `label` also names the listbox.
- **It costs one glyph of width** no matter how many locales you
  support, which is why it replaced the native `<select>`: a select
  grows to fit the longest option, and the built-in table has 436 of
  them.
- **An option carries `lang` only when its label is the derived
  endonym**, so a screen reader pronounces "Cymraeg" with a Welsh
  voice (WCAG 3.1.2, Language of Parts) and an English fallback label
  is never handed to the wrong voice. Consumer-labelled options carry
  no `lang`; neither do the button and the list.
- **`name` is the hidden input's name**, so the value still posts
  with a surrounding form.
- **Element ids come from a module counter** (`nextLocalePickerId()`),
  so they are stable across SSR and hydration.
- **The keyboard contract is the APG listbox pattern**, implemented
  by the component: arrows (clamping, no wrap), `Home` / `End`,
  `PageUp` / `PageDown` (by ten, clamping), `Enter` / `Space` to
  commit, `Escape` to cancel, `Tab` to close via the button so the
  default Tab proceeds from the picker's position, and
  printable-character typeahead over the labels — a repeated
  character cycles through its matches. See
  [Accessibility](#accessibility).

Because the closed control shows only a glyph, the active locale has
no on-screen representation of its own. Surface it yourself — the
quick start above shows the `.locale-picker-status` pattern this
package treats as the default.

To style the control, target the class hooks from your own stylesheet
(the helper ships zero CSS): `.locale-picker` (root),
`.locale-picker-button`, `.locale-picker-icon`, `.locale-picker-list`,
and `.locale-picker-option` (with `[data-active]` for the
keyboard-active row and `[aria-selected="true"]` for the committed
one).

## BCP 47 normalisation

Language tags follow **BCP 47** (RFC 5646). The `lang` attribute on
HTML elements must use hyphens, while many applications carry
locale identifiers with underscores (`en_US`, `zh_Hant_TW`). The
picker accepts whichever form you prefer in the `locales` array
and converts to the hyphen form when writing to the DOM. The
bindable `value` preserves your original form, so round-trips are
lossless.

```ts
bcp47LocaleTag("en_US"); // "en-US"
bcp47LocaleTag("zh_Hant_TW"); // "zh-Hant-TW"
bcp47LocaleTag("en"); // "en"
```

References:

- W3C — [Language tags in HTML and XML](https://www.w3.org/International/articles/language-tags/)
- IETF — [RFC 5646 (BCP 47), Tags for Identifying Languages](https://www.rfc-editor.org/rfc/rfc5646)
- IANA — [Language Subtag Registry (registry file)](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)

## RTL auto-detection

`isRtlLocale(locale)` returns `true` for any locale whose base
language is one of `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`,
`ji`, `ks`, `ku`, `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`, OR whose
script subtag is one of `Arab`, `Hebr`, `Thaa`, `Syrc`, `Nkoo`,
`Mong`, `Adlm`.

```ts
isRtlLocale("ar"); // true
isRtlLocale("he_IL"); // true
isRtlLocale("uz_Arab_AF"); // true (script subtag)
isRtlLocale("en"); // false
```

Pass `:apply-dir="false"` if you want full control of `dir`
yourself.

## Examples

### Minimal mount

```vue
<script setup lang="ts">
import { ref } from "vue";
import LocalePicker from "./lily-design-system-vue-locale-picker/LocalePicker.vue";
const locale = ref("en");
</script>

<template>
  <LocalePicker
    label="Language"
    :locales="['en', 'cy']"
    v-model:value="locale"
  />
</template>
```

That renders the markup shown under [The control](#the-control): a
globe button and a hidden listbox with one `<li role="option">` per
locale, each carrying its own `lang` when its label is the endonym.

### Pretty labels for the option text

By default each option shows the language's **endonym** — its own
name for itself, "Cymraeg" not "Welsh" — via `Intl.DisplayNames`
asked in that language (exported as `localeEndonym`). The user who
needs a language menu is the one who cannot read the page's
language, and the exonym means nothing to them. The English names
from `locales.tsv` and the raw code remain as fallbacks for runtimes
without the data. Override per-code with `localeLabels`:

```vue
<LocalePicker
  label="Langue"
  :locales="['en', 'fr', 'ar']"
  :locale-labels="{ en: 'English', fr: 'Français', ar: 'العربية' }"
  v-model:value="locale"
/>
```

### Replacing the button glyph

The default scoped slot replaces the **button glyph** — not the
options. The listbox, the option markup, the keyboard contract, and
the apply lifecycle all stay component-owned. The slot receives
`{ value, open, labelFor }`:

```vue
<LocalePicker
  label="Language"
  :locales="['en', 'fr', 'es', 'de', 'ar']"
  v-model:value="locale"
  storage-key="lily-locale"
>
    <template #default="{ value, open, labelFor }">
        <span
            class="locale-picker-code"
            :title="labelFor(value)"
            aria-hidden="true"
            >{{ value.split(/[-_]/)[0].toUpperCase() }}</span
        >
        <span class="locale-picker-caret" aria-hidden="true">{{
            open ? "▴" : "▾"
        }}</span>
    </template>
</LocalePicker>
```

Whatever the slot renders is decorative. The button's accessible name
always comes from `label` via `aria-label`, so mark slot content
`aria-hidden="true"` (or keep it text-free) rather than letting it
compete for the name. Showing the active locale's short code is the
common case — it gives sighted users the value the bare glyph hides.

If you need a genuinely different control shape — an always-visible
button row, a free-text combobox — render it yourself alongside the
component and bind both to the same ref. `LocalePicker` keeps owning
the apply lifecycle; your markup is simply a second way to write the
bound value. See
[`examples/combobox.vue`](./examples/combobox.vue).

### Wiring an i18n library (`vue-i18n`)

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import LocalePicker from "./lily-design-system-vue-locale-picker/LocalePicker.vue";

const { locale } = useI18n();
const current = ref<string>(locale.value);
</script>

<template>
  <LocalePicker
    label="Language"
    :locales="['en', 'fr', 'ar']"
    v-model:value="current"
    detect-from-navigator
    storage-key="app-locale"
    @change="(code) => (locale = code)"
  />
</template>
```

### Server-resolved initial value (SSR)

For flicker-free first paint, resolve the locale on the server
(from a cookie or `Accept-Language`) and pass it as `value`:

```vue
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ initialLocale: string }>();
const locale = ref(props.initialLocale);
</script>

<template>
  <LocalePicker
    label="Language"
    :locales="['en', 'fr', 'ar']"
    v-model:value="locale"
    :value="locale"
  />
</template>
```

During SSR the component renders the button and the hidden listbox
with the supplied value marked `aria-selected="true"`, and the
document already arrives with the correct `lang` attribute on
`<html>`.

### Render into a scoped target instead of `<html>`

Set `target` to a specific element when you want the locale scoped
to a region (e.g. a multilingual side panel):

```vue
<script setup lang="ts">
import { ref } from "vue";
import LocalePicker from "./lily-design-system-vue-locale-picker/LocalePicker.vue";

const region = ref<HTMLElement | null>(null);
const panelLocale = ref("fr");
</script>

<template>
  <section ref="region">
    <p>This panel switches language independently of the page.</p>
    <LocalePicker
      label="Panel language"
      :locales="['en', 'fr', 'ar']"
      :target="region"
      v-model:value="panelLocale"
    />
  </section>
</template>
```

`<html>` stays in the page's default locale; the section gets the
chosen one.

## Built-in locale data

`locales.ts` ships the 436 codes from `locales.tsv` mapped to their
English names. Since the endonym change these are a **fallback** —
the default label is `localeEndonym(code)`, and the table is
consulted only when the runtime lacks `Intl.DisplayNames` data for a
code. You can also import the data directly:

```ts
import {
  defaultLocaleLabels,
  RTL_LANGUAGE_TAGS,
  RTL_SCRIPT_SUBTAGS,
} from "./lily-design-system-vue-locale-picker";

console.log(defaultLocaleLabels["en_US"]); // "English (United States)"
console.log(RTL_LANGUAGE_TAGS.has("ar")); // true
```

## Props

See [spec/index.md §4](./spec/index.md#4-public-api) for the full table.

Required props: `label`, `locales`.

`label` names **both** the button and the listbox. The button is
icon-only, so this is its only accessible name — pick it carefully;
see [Accessibility](#accessibility).

Common optional props: `value` (bindable via `v-model:value`),
`defaultValue`, `storageKey`, `detectFromNavigator`, `localeLabels`,
`applyDir`, `target`, `class` (on the root `<div>`), `name` (on the
hidden input).

There is no `placeholder` prop — it was removed along with the
`<select>` it used to pin.

## Events

| Event          | Payload  | When                                                         |
| -------------- | -------- | ------------------------------------------------------------ |
| `update:value` | `string` | After selection, drives `v-model:value`.                     |
| `change`       | `string` | After the picker applies a new locale (consumer-form code). |

## Accessibility

- The control is a `<button aria-haspopup="listbox" aria-expanded
aria-controls>` paired with a `<ul role="listbox">` of
  `<li role="option" aria-selected>` — the WAI-ARIA APG listbox
  pattern.
- The keyboard contract is implemented by the component: on the
  button, `ArrowDown` / `Enter` / `Space` open with the selected
  option active and `ArrowUp` opens with the last one active; on the
  listbox, arrows move the active option (clamping, never wrapping),
  `Home` / `End` jump to the ends, `PageUp` / `PageDown` move by ten
  (clamping), `Enter` / `Space` commit, `Escape` cancels, `Tab`
  closes after moving focus to the button — without cancelling the
  key — so the default Tab proceeds from the picker's position, and
  printable characters run a 500 ms typeahead over the labels where a
  repeated character cycles through its matches. Focus moves to the
  `<ul>` on open and returns to the button on commit or cancel; the
  active option travels via `aria-activedescendant`.
- A locale `<li role="option">` carries `lang="…"` only when its
  label is the derived endonym, so its name is pronounced in the
  right language (WCAG 3.1.2, Language of Parts) and an English
  fallback label is never sent to the wrong speech engine.
- The document root carries `lang` and (by default) `dir` so the
  page satisfies WCAG 3.1.1 (Language of Page) and bidi
  text/layout inverts correctly for RTL locales.
- No colour-only meaning; the active state is in `aria-selected`, the
  hidden input, the resolved `lang` / `dir` attributes, and the
  `v-model:value` binding.

Three tradeoffs come with the icon-button shape, and all three are
worth reading before you ship it:

1. **The button has no visible text**, so `label` is its whole
   accessible name — with a particular irony for a _language_ picker,
   since `label` is itself written in one language.
2. **A custom listbox has weaker assistive-technology support** than
   the native `<select>` it replaced, and there is no OS-native
   picker on mobile.
3. **The 🌐 glyph renders however the user's fonts render it** — or
   not at all.

The compensating pattern is a visible `.locale-picker-status` region
carrying `aria-live="polite"`, shipped in the quick start above.
[`docs/accessibility.md`](./docs/accessibility.md) has the full
reasoning for all of it.

## SSR

The picker is SSR-safe — all DOM writes happen inside `onMounted` /
`watch`. For flicker-free first paint, resolve the locale on the
server (cookie / `Accept-Language`) and pass it as `value`. See
[docs/ssr.md](./docs/ssr.md) for the Nuxt 3 recipe.

## Files in this directory

| File                    | Purpose                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| `spec/index.md`         | Single source of truth — API, behaviour, tests.                      |
| `AGENTS.md`             | Fast-index pointer; loads the AGENTS bundle.                         |
| `AGENTS/`               | Topic-by-topic agent files.                                          |
| `CLAUDE.md`             | `@AGENTS.md`.                                                        |
| `LocalePicker.vue`     | The component implementation.                                        |
| `LocalePicker.test.ts` | vitest suite covering every spec §7 item.                            |
| `locales.ts`            | Built-in code → English-name map and RTL sets.                       |
| `locales.tsv`           | Canonical 436-row source for `locales.ts`.                           |
| `index.ts`              | Re-export barrel.                                                    |
| `index.md`              | This file.                                                           |
| `docs/`                 | Deep-dive guides — see [Documentation](#documentation).              |
| `examples/`             | Runnable Vue 3 SFCs — see [Examples directory](#examples-directory). |
| `CHANGELOG.md`          | Version history.                                                     |

## Documentation

| Guide                                                  | Covers                                                                 |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| [docs/concepts.md](./docs/concepts.md)                 | Mental model, lifecycle diagram, why the defaults are what they are.   |
| [docs/bcp47.md](./docs/bcp47.md)                       | Language-tag syntax (RFC 5646), IANA registry, subtag composition.     |
| [docs/rtl.md](./docs/rtl.md)                           | What's auto-detected, what `dir="rtl"` actually changes, CSS tips.     |
| [docs/i18n-integration.md](./docs/i18n-integration.md) | Wiring vue-i18n, @intlify, Tolgee, raw `Intl.*`, Nuxt i18n strategies. |
| [docs/ssr.md](./docs/ssr.md)                           | Cookie, URL-prefix, Accept-Language, FOUC avoidance for Nuxt 3.        |
| [docs/accessibility.md](./docs/accessibility.md)       | WCAG 2.2 AAA mapping, keyboard contract, screen-reader matrix.         |
| [docs/props-reference.md](./docs/props-reference.md)   | Field-by-field reference for every public prop and event.              |
| [docs/styling.md](./docs/styling.md)                   | Class and attribute hooks, listbox positioning, baseline CSS.          |
| [docs/custom-rendering.md](./docs/custom-rendering.md) | Replacing the button glyph via the default scoped slot.                |
| [docs/recipes.md](./docs/recipes.md)                   | Task-shaped answers: endonyms, cookies, scoped targets, Intl.          |
| [docs/troubleshooting.md](./docs/troubleshooting.md)   | Symptom-first fixes for the common failure modes.                      |

## Examples directory

Each file in `examples/` is a complete, runnable Vue 3 SFC you can
copy into your project.

| Example                                                     | Demonstrates                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [basic.vue](./examples/basic.vue)                           | The default rendering, plus the `.locale-picker-status` live region.           |
| [custom-rendering.vue](./examples/custom-rendering.vue)     | Custom button glyph — the active locale's short code — via the default slot.    |
| [script-aware-glyph.vue](./examples/script-aware-glyph.vue) | Script-aware button glyph: the active locale in its own script and direction.   |
| [rtl-demo.vue](./examples/rtl-demo.vue)                     | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.                       |
| [nhs-style.vue](./examples/nhs-style.vue)                   | NHS UK-style utility banner with endonyms and a status line.                    |
| [with-vue-i18n.vue](./examples/with-vue-i18n.vue)           | Binding to vue-i18n's `locale` ref.                                             |
| [with-paraglide.vue](./examples/with-paraglide.vue)         | Driving Paraglide JS's `setLocale()` from `@change`.                            |
| [ssr-cookie.vue](./examples/ssr-cookie.vue)                 | Nuxt 3 cookie-based SSR — no flash of default locale.                           |
| [scoped-target.vue](./examples/scoped-target.vue)           | Multiple per-region pickers, each scoped to its own panel.                     |
| [combobox.vue](./examples/combobox.vue)                     | Built-in typeahead over 436 locales, plus a side-by-side `<datalist>` combobox. |

---

Lily™ and Lily Design System™ are trademarks.
