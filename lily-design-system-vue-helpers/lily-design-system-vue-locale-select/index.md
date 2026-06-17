# LocaleSelect (Vue helper)

A reusable, headless Vue 3 locale picker that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection.

For the full contract see [spec.md](./spec.md) — it is the single
source of truth for the API, behaviour, and tests. For topic
deep-dives see [docs/](./docs/) and for working code see
[examples/](./examples/).

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
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
import LocaleSelect from "./lily-design-system-vue-locale-select/LocaleSelect.vue";
```

Or via the barrel (recommended; gives you the typed helpers too):

```ts
import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    type Props,
    type SlotArgs,
} from "./lily-design-system-vue-locale-select";
```

## Quick start

Render the picker with a `label` and the list of locales your app
supports. The picker writes `lang` and `dir` onto `<html>` so your
i18n library, your CSS (`html[dir="rtl"]`), and assistive
technology all see the change.

```vue
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect from "./lily-design-system-vue-locale-select/LocaleSelect.vue";

const locale = ref("");
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'en_US', 'fr', 'fr_CA', 'ar', 'he']"
        v-model:value="locale"
        storage-key="lily-locale"
        detect-from-navigator
    />
</template>
```

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

## BCP 47 normalisation

Language tags follow **BCP 47** (RFC 5646). The `lang` attribute on
HTML elements must use hyphens, while many applications carry
locale identifiers with underscores (`en_US`, `zh_Hant_TW`). The
picker accepts whichever form you prefer in the `locales` array
and converts to the hyphen form when writing to the DOM. The
bindable `value` preserves your original form, so round-trips are
lossless.

```ts
bcp47LocaleTag("en_US");      // "en-US"
bcp47LocaleTag("zh_Hant_TW"); // "zh-Hant-TW"
bcp47LocaleTag("en");         // "en"
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
isRtlLocale("ar");         // true
isRtlLocale("he_IL");      // true
isRtlLocale("uz_Arab_AF"); // true (script subtag)
isRtlLocale("en");         // false
```

Pass `:apply-dir="false"` if you want full control of `dir`
yourself.

## Examples

### Default `<select>` with NHS-style markup

```vue
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect from "./lily-design-system-vue-locale-select/LocaleSelect.vue";
const locale = ref("en");
</script>

<template>
    <LocaleSelect label="Language" :locales="['en', 'cy']" v-model:value="locale" />
</template>

<!-- Renders:
<select class="locale-select" aria-label="Language" name="locale">
    <option class="locale-select-option" value="en" lang="en">English</option>
    <option class="locale-select-option" value="cy" lang="cy">Welsh</option>
</select>
-->
```

Each option carries its own `lang` attribute so a screen reader
pronounces "Cymraeg" with a Welsh voice (WCAG 3.1.2, Language of
Parts).

### Pretty labels for the option text

By default the picker uses the English names from `locales.tsv`
(and falls back to `Intl.DisplayNames` if available, then to the
raw code). Override per-code with `localeLabels`:

```vue
<LocaleSelect
    label="Langue"
    :locales="['en', 'fr', 'ar']"
    :locale-labels="{ en: 'English', fr: 'Français', ar: 'العربية' }"
    v-model:value="locale"
/>
```

### Driving custom `<option>` markup

Use the default scoped slot for full markup control. The picker
still owns the apply lifecycle:

```vue
<LocaleSelect
    label="Language"
    :locales="['en', 'fr', 'es', 'de', 'ar']"
    v-model:value="locale"
    storage-key="lily-locale"
>
    <template #default="{ locales, value, setLocale, labelFor, tagFor }">
        <select
            aria-label="Language"
            @change="(e) => setLocale((e.target as HTMLSelectElement).value)"
        >
            <option
                v-for="l in locales"
                :key="l"
                :value="l"
                :lang="tagFor(l)"
                :selected="value === l"
            >
                {{ labelFor(l) }}
            </option>
        </select>
    </template>
</LocaleSelect>
```

### Driving a button group

```vue
<LocaleSelect label="Language" :locales="['en', 'fr', 'ar']" v-model:value="locale">
    <template #default="{ locales, value, setLocale, labelFor, tagFor, isRtl }">
        <ul class="locale-select-list" role="list">
            <li v-for="l in locales" :key="l">
                <button
                    type="button"
                    :aria-pressed="value === l"
                    :lang="tagFor(l)"
                    :dir="isRtl(l) ? 'rtl' : 'ltr'"
                    @click="setLocale(l)"
                >
                    {{ labelFor(l) }}
                </button>
            </li>
        </ul>
    </template>
</LocaleSelect>
```

### Wiring an i18n library (`vue-i18n`)

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import LocaleSelect from "./lily-design-system-vue-locale-select/LocaleSelect.vue";

const { locale } = useI18n();
const current = ref<string>(locale.value);
</script>

<template>
    <LocaleSelect
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
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
        :value="locale"
    />
</template>
```

During SSR the component renders the `<select>` with the supplied
value selected, and the document already arrives with the correct
`lang` attribute on `<html>`.

### Render into a scoped target instead of `<html>`

Set `target` to a specific element when you want the locale scoped
to a region (e.g. a multilingual side panel):

```vue
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect from "./lily-design-system-vue-locale-select/LocaleSelect.vue";

const region = ref<HTMLElement | null>(null);
const panelLocale = ref("fr");
</script>

<template>
    <section ref="region">
        <p>This panel switches language independently of the page.</p>
        <LocaleSelect
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
English names. The component falls back to this table when
`localeLabels` does not have an entry for a code. You can also
import the data directly:

```ts
import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./lily-design-system-vue-locale-select";

console.log(defaultLocaleLabels["en_US"]); // "English (United States)"
console.log(RTL_LANGUAGE_TAGS.has("ar"));  // true
```

## Props

See [spec.md §4](./spec.md#4-public-api) for the full table.

Required props: `label`, `locales`.

Common optional props: `value` (bindable via `v-model:value`),
`defaultValue`, `storageKey`, `detectFromNavigator`, `localeLabels`,
`applyDir`, `target`, `class`, `name`.

## Events

| Event           | Payload  | When                                                  |
| --------------- | -------- | ----------------------------------------------------- |
| `update:value`  | `string` | After selection, drives `v-model:value`.              |
| `change`        | `string` | After the picker applies a new locale (consumer-form code). |

## Accessibility

- `<select aria-label="…">` is the announced control (implicit
  `combobox` role).
- The native `<select>` gives Arrow / Home / End / typeahead
  semantics for free.
- Each `<option>` carries `lang="…"` so its name is pronounced
  in the right language (WCAG 3.1.2, Language of Parts).
- The document root carries `lang` and (by default) `dir` so the
  page satisfies WCAG 3.1.1 (Language of Page) and bidi
  text/layout inverts correctly for RTL locales.
- No colour-only meaning; the active state is also visible in the
  resolved `lang` attribute and in the `<select>`'s current value.

## SSR

The picker is SSR-safe — all DOM writes happen inside `onMounted` /
`watch`. For flicker-free first paint, resolve the locale on the
server (cookie / `Accept-Language`) and pass it as `value`. See
[docs/ssr.md](./docs/ssr.md) for the Nuxt 3 recipe.

## Files in this directory

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec.md`                     | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`                   | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`                     | Topic-by-topic agent files.                      |
| `CLAUDE.md`                   | `@AGENTS.md`.                                    |
| `LocaleSelect.vue`            | The component implementation.                    |
| `LocaleSelect.test.ts`        | vitest suite covering every spec §7 item.        |
| `locales.ts`                  | Built-in code → English-name map and RTL sets.   |
| `locales.tsv`                 | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                    | Re-export barrel.                                |
| `index.md`                    | This file.                                       |
| `docs/`                       | Deep-dive guides — see [Documentation](#documentation). |
| `examples/`                   | Runnable Vue 3 SFCs — see [Examples directory](#examples-directory). |
| `CHANGELOG.md`                | Version history.                                 |

## Documentation

| Guide                                                | Covers                                                                  |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| [docs/concepts.md](./docs/concepts.md)               | Mental model, lifecycle diagram, why the defaults are what they are.    |
| [docs/bcp47.md](./docs/bcp47.md)                     | Language-tag syntax (RFC 5646), IANA registry, subtag composition.      |
| [docs/rtl.md](./docs/rtl.md)                         | What's auto-detected, what `dir="rtl"` actually changes, CSS tips.      |
| [docs/i18n-integration.md](./docs/i18n-integration.md) | Wiring vue-i18n, @intlify, Tolgee, raw `Intl.*`, Nuxt i18n strategies. |
| [docs/ssr.md](./docs/ssr.md)                         | Cookie, URL-prefix, Accept-Language, FOUC avoidance for Nuxt 3.         |
| [docs/accessibility.md](./docs/accessibility.md)     | WCAG 2.2 AAA mapping, keyboard contract, screen-reader matrix.          |

## Examples directory

Each file in `examples/` is a complete, runnable Vue 3 SFC you can
copy into your project.

| Example                                                                                 | Demonstrates                                                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [01-radios.vue](./examples/01-radios.vue)                                               | The default native `<select>` rendering.                          |
| [02-select.vue](./examples/02-select.vue)                                               | Custom `<select>` markup via the default scoped slot.             |
| [03-buttons.vue](./examples/03-buttons.vue)                                             | Toggle-button group with short codes / glyphs.                     |
| [04-rtl-demo.vue](./examples/04-rtl-demo.vue)                                           | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| [05-nhs-style.vue](./examples/05-nhs-style.vue)                                         | NHS UK-style language banner with endonyms.                        |
| [06-with-vue-i18n.vue](./examples/06-with-vue-i18n.vue)                                 | Binding to vue-i18n's `locale` ref.                                |
| [07-with-paraglide.vue](./examples/07-with-paraglide.vue)                               | Driving Paraglide JS's `setLocale()` from `@change`.               |
| [08-ssr-cookie.vue](./examples/08-ssr-cookie.vue)                                       | Nuxt 3 cookie-based SSR — no flash of default locale.              |
| [09-scoped-target.vue](./examples/09-scoped-target.vue)                                 | Multiple per-region pickers, each scoped to its own panel.         |
| [10-combobox.vue](./examples/10-combobox.vue)                                           | Native `<datalist>` type-ahead for 436 locales.                    |
