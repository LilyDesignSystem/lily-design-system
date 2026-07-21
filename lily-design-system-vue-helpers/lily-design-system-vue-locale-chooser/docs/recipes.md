# Recipes

Task-shaped answers. Each one is self-contained; copy and edit.

## Detect the browser's language on first visit

```vue
<LocaleChooser
    label="Language"
    :locales="['en', 'fr', 'de', 'ar']"
    detect-from-navigator
    storage-key="my-app:locale"
/>
```

Resolution order is `value` > storage > navigator detection >
`defaultValue` > `"en"` > `locales[0]`, so a returning user's stored
choice still wins. Detection only decides the very first visit.

Matching is two-pass: exact first (`fr-CA` → `fr_CA`), then
language-only (`fr-CA` → `fr`). If neither hits, detection yields
nothing and resolution falls through.

This mirrors `detect-from-system` on theme-chooser.

## Show each language in its own language (endonyms)

The single highest-value thing you can do for a locale chooser. A user
looking for their language scans for *their* word for it, not the
English one.

```vue
<LocaleChooser
    label="Language"
    :locales="['en', 'fr', 'de', 'es', 'ar', 'ja']"
    :locale-labels="{
        en: 'English',
        fr: 'Français',
        de: 'Deutsch',
        es: 'Español',
        ar: 'العربية',
        ja: '日本語',
    }"
/>
```

Each `<li>` already carries its own `lang`, so a screen reader
pronounces each endonym with the right voice and the browser picks a
font that can render the script — no extra work.

## Read a locale cookie before render (Nuxt 3)

The flicker-free path: resolve on the server, hand the chooser an
explicit `value`, and let `value`-beats-everything do the rest.

```vue
<script setup lang="ts">
import LocaleChooser, { bcp47LocaleTag, isRtlLocale } from "lily-design-system-vue-locale-chooser";

const locale = useCookie<string>("locale", { default: () => "en" });

useHead({
    htmlAttrs: {
        lang: computed(() => bcp47LocaleTag(locale.value)),
        dir: computed(() => (isRtlLocale(locale.value) ? "rtl" : "ltr")),
    },
});
</script>

<template>
    <LocaleChooser label="Language" :locales="['en', 'fr', 'ar']" v-model:value="locale" />
</template>
```

`useHead` puts the right `lang` / `dir` in the server-rendered HTML;
the chooser then re-applies the same values on mount, so nothing
flashes. See [ssr.md](./ssr.md) and
[`../examples/ssr-cookie.vue`](../examples/ssr-cookie.vue).

## Migrate from localStorage-only to cookie-backed

Storage is client-only, so the server cannot see it and the first
paint is always the default. To move to cookies without losing
existing users' choices, write both for one release:

```vue
<script setup lang="ts">
const cookie = useCookie<string>("locale");

function onChange(code: string) {
    cookie.value = code; // new home
}
</script>

<template>
    <LocaleChooser
        label="Language"
        :locales="locales"
        :value="cookie || undefined"
        storage-key="my-app:locale"
        @change="onChange"
    />
</template>
```

The cookie wins when present (it arrives as `value`); storage still
seeds users who have not switched yet. Drop `storage-key` a release
later.

## Change the locale of one region, not the page

```vue
<script setup lang="ts">
const panel = ref<HTMLElement | null>(null);
</script>

<template>
    <section ref="panel">
        <LocaleChooser label="Quotation language" :locales="['en', 'ar']" :target="panel" />
        <blockquote>…</blockquote>
    </section>
</template>
```

`target` scopes `lang` / `dir` to that element. This is WCAG 3.1.2
(Language of Parts) — the correct tool when the page language stays
put and only a fragment changes. See
[`../examples/scoped-target.vue`](../examples/scoped-target.vue).

Give each scoped select a distinct `name` if several sit in one form.

## Drive vue-i18n

```vue
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import LocaleChooser, { bcp47LocaleTag } from "lily-design-system-vue-locale-chooser";

const { locale, availableLocales } = useI18n();
</script>

<template>
    <LocaleChooser
        label="Language"
        :locales="availableLocales"
        v-model:value="locale"
        storage-key="my-app:locale"
    />
</template>
```

vue-i18n's `locale` is a writable ref, so `v-model:value` binds
straight to it. Keep the codes in one form across both — if vue-i18n
uses `en-US`, pass `en-US`, not `en_US`.

## Drive an imperative i18n library (Paraglide)

Libraries with a `setLocale()` call rather than a ref need the
`change` event:

```vue
<script setup lang="ts">
import { setLocale } from "$lib/paraglide/runtime";
</script>

<template>
    <LocaleChooser
        label="Language"
        :locales="['en', 'fr', 'de']"
        @change="(code) => setLocale(code)"
    />
</template>
```

`change` fires *after* the chooser has applied `lang` / `dir` /
storage, so the DOM is already consistent when your library reloads
its messages. See [i18n-integration.md](./i18n-integration.md).

## Format dates and numbers with the same locale

The chooser owns the selection, not the formatting. Derive your
formatters from the bound ref:

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { bcp47LocaleTag } from "lily-design-system-vue-locale-chooser";

const locale = ref("en");
const tag = computed(() => bcp47LocaleTag(locale.value));

const dateFmt = computed(() => new Intl.DateTimeFormat(tag.value, { dateStyle: "long" }));
const numFmt = computed(() => new Intl.NumberFormat(tag.value));
</script>
```

Always pass the **BCP 47 tag** to `Intl.*`. `new Intl.DateTimeFormat("en_US")`
throws a `RangeError`; `"en-US"` does not.

## Sort the list the way users scan it

Alphabetical-by-English-name is rarely what people want. Put the
locales your audience actually uses first, then sort the tail in the
user's own collation:

```ts
const PRIORITY = ["en", "es", "zh_Hans"];

const ordered = computed(() => {
    const rest = ALL.filter((c) => !PRIORITY.includes(c));
    const collator = new Intl.Collator(bcp47LocaleTag(locale.value));
    return [...PRIORITY, ...rest.sort((a, b) => collator.compare(labelOf(a), labelOf(b)))];
});
```

`Intl.Collator` matters: a plain `.sort()` puts accented and
non-Latin labels in an order that looks arbitrary to a native reader.

## Sync the locale across tabs

```vue
<script setup lang="ts">
const locale = ref("en");

function onStorage(event: StorageEvent) {
    if (event.key === "my-app:locale" && event.newValue) locale.value = event.newValue;
}

onMounted(() => window.addEventListener("storage", onStorage));
onBeforeUnmount(() => window.removeEventListener("storage", onStorage));
</script>
```

The `storage` event fires in *other* tabs only, so there is no loop.

## Announce the change to screen readers

The button is icon-only, so nothing announces the new locale unless
you render it. This is the documented default pattern, not an extra:

```vue
<template>
    <LocaleChooser label="Language" :locales="locales" v-model:value="locale" />
    <p class="locale-chooser-status" role="status" :lang="bcp47LocaleTag(locale)">
        {{ localeName(locale) }}
    </p>
</template>
```

Style it visually-hidden if the design has no room — but keep it in
the accessibility tree. See [accessibility.md](./accessibility.md) and
the visually-hidden CSS in [styling.md](./styling.md).

## Offer a searchable list for many locales

The built-in typeahead (500 ms buffer, matches on label) handles
dozens of entries. Past that, render a `<datalist>` combobox alongside
and bind both to the same ref — the chooser keeps owning the lifecycle:

```vue
<LocaleChooser label="Language" :locales="ALL" v-model:value="locale" />
<input list="locale-options" v-model="locale" />
<datalist id="locale-options">
    <option v-for="c in ALL" :key="c" :value="c">{{ localeName(c) }}</option>
</datalist>
```

See [`../examples/combobox.vue`](../examples/combobox.vue).

## Keep the label findable when the page is in the wrong language

The user most in need of this control cannot read the page. Consider a
bilingual `label`:

```vue
<LocaleChooser label="Language / Idioma" :locales="['en', 'es']" />
```

There is no general answer — see the `label` discussion in
[props-reference.md](./props-reference.md) — but the globe glyph plus a
bilingual name covers most real cases.

## See also

- [props-reference.md](./props-reference.md) — every prop in detail.
- [ssr.md](./ssr.md) — the full SSR story.
- [i18n-integration.md](./i18n-integration.md) — library wiring.
- [troubleshooting.md](./troubleshooting.md) — when a recipe misbehaves.
