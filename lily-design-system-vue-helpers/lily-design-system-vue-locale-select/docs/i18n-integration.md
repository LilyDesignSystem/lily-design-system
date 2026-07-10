# i18n integration

`LocaleSelect` is intentionally not an i18n library. It changes the
document language and tells you when the user changed it; the
actual string substitution is your i18n library's job.

This page shows how to wire the select to the four most common
Vue 3 i18n stacks: **vue-i18n** (Intlify), **@nuxtjs/i18n**,
**Paraglide JS** (Inlang), and **raw `Intl.*`**.

The wiring pattern is always the same:

1. Bind `value` to your i18n library's current-locale ref/store.
2. Listen to `@change` if your library also needs an imperative
   call.
3. (Optionally) pre-seed `value` server-side for flicker-free SSR.

---

## vue-i18n (Intlify)

[vue-i18n](https://vue-i18n.intlify.dev/) exposes a `locale` ref via
`useI18n()`. The select writes to it via `v-model:value`.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import LocaleSelect from "@/lib/LocaleSelect.vue";

const { locale } = useI18n();
const current = ref<string>(locale.value);

function onChange(code: string) {
    locale.value = code;
}
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="current"
        storage-key="app-locale"
        detect-from-navigator
        @change="onChange"
    />
</template>
```

The select writes to `current`, and the `@change` handler mirrors
the value into `vue-i18n`'s locale ref so every `t("…")` call in
your templates re-evaluates against the new locale.

You can also bind `vue-i18n`'s `locale` ref directly:

```vue
<LocaleSelect
    label="Language"
    :locales="['en', 'fr', 'ar']"
    v-model:value="locale"
/>
```

Use whichever fits your reactivity story.

---

## @nuxtjs/i18n

[@nuxtjs/i18n](https://i18n.nuxtjs.org/) provides a `useI18n()`
composable and a `setLocale()` method. It also handles URL-based
locale strategies.

```vue
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect from "@/components/LocaleSelect.vue";

const { locale, setLocale } = useI18n();
const current = ref<string>(locale.value);
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="current"
        storage-key="nuxt-locale"
        @change="(code) => setLocale(code)"
    />
</template>
```

Nuxt i18n's URL-prefix strategy needs a `router.push` instead of
`setLocale`:

```ts
const route = useRoute();
const router = useRouter();
function navigateToLocale(next: string) {
    const path = String(route.path).replace(/^\/(en|fr|ar)/, `/${next}`);
    router.push(path);
}
```

---

## Paraglide JS (Inlang)

[Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)
compiles messages into tiny tree-shakeable functions and tracks
language via `setLocale()` / `getLocale()`.

```vue
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect from "@/lib/LocaleSelect.vue";
import { setLocale, getLocale, type Locale } from "@/paraglide/runtime.js";

const current = ref<string>(getLocale());
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="current"
        storage-key="paraglide-locale"
        @change="(code) => setLocale(code as Locale)"
    />
</template>
```

Paraglide's message functions read `getLocale()` synchronously.
Wrap your template in a `<template :key="current">` block (or use
`<KeepAlive :key="current">`) if you need Vue to re-render every
node when the locale changes.

---

## Raw `Intl.*`

For apps with a handful of strings and no formal i18n library,
store the locale in a `ref` and pass it to `Intl` formatters
directly. The select still owns the `lang` / `dir` lifecycle:

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import LocaleSelect from "@/lib/LocaleSelect.vue";

const locale = ref("en");

const dateFmt = computed(() =>
    new Intl.DateTimeFormat(locale.value, { dateStyle: "long" }),
);
const numFmt = computed(() => new Intl.NumberFormat(locale.value));
const currencyFmt = computed(() =>
    new Intl.NumberFormat(locale.value, { style: "currency", currency: "GBP" }),
);

const today = new Date();
const balance = 1234.56;
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'en-US', 'fr', 'fr-CA', 'ar']"
        v-model:value="locale"
        storage-key="app-locale"
    />

    <p>Today: {{ dateFmt.format(today) }}</p>
    <p>Balance: {{ currencyFmt.format(balance) }}</p>
    <p>Population: {{ numFmt.format(67_330_000) }}</p>
</template>
```

`Intl.*` formatters accept both `en_US` and `en-US`; they
normalise internally. The bindable `value` works either way.

---

## Nuxt 3 URL-prefix strategies

If your app uses URL-prefixed locales (`/en/about`,
`/fr/about`), the select's `@change` calls `router.push`:

```vue
<script setup lang="ts">
import { computed } from "vue";
import LocaleSelect from "@/lib/LocaleSelect.vue";

const route = useRoute();
const router = useRouter();

const current = computed(() => String(route.params.locale ?? "en"));

function navigateToLocale(next: string) {
    const path = String(route.path).replace(/^\/(en|fr|ar)/, `/${next}`);
    router.push(path);
}
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        :value="current"
        v-model:value="current"
        @change="navigateToLocale"
    />
</template>
```

`:value="current"` (one-way) + `v-model:value="current"`
(two-way) means the select reflects the URL on every navigation
but also writes back when the user picks a new locale. The
`router.push` invalidates loaders so the new locale's data fetches
re-run.

---

## Cookie-based persistence (server)

`localStorage` persistence flickers on first paint because the
server renders the default locale before the client reads
storage. Prefer a cookie when you have a Nuxt server:

```ts
// server/middleware/locale.ts
import { defineEventHandler, getCookie } from "h3";

export default defineEventHandler((event) => {
    const locale = getCookie(event, "locale") ?? "en";
    event.context.locale = locale;
});
```

```vue
<!-- app.vue -->
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect, { isRtlLocale, bcp47LocaleTag } from "@/lib/LocaleSelect.vue";

const { $initialLocale } = useNuxtApp() as unknown as { $initialLocale: string };
const locale = ref<string>($initialLocale);

useHead({
    htmlAttrs: {
        lang: () => bcp47LocaleTag(locale.value),
        dir: () => (isRtlLocale(locale.value) ? "rtl" : "ltr"),
    },
});

function persist(code: string) {
    document.cookie = `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
}
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
        @change="persist"
    />
    <NuxtPage />
</template>
```

The page arrives with the correct `lang` and `dir` already on
`<html>`, no flash. See [./ssr.md](./ssr.md) for more.

---

## Picking the right strategy

| Need                                       | Strategy                  |
| ------------------------------------------ | ------------------------- |
| One small SPA, English + French only       | Raw `Intl.*`              |
| ICU MessageFormat, plurals, gender         | vue-i18n                  |
| Tree-shaken type-safe messages, edge SSR   | Paraglide JS              |
| Translator CMS, live editing, screenshots  | Tolgee                    |
| SEO-friendly URLs per locale               | @nuxtjs/i18n              |
| No FOUC, cookie-backed, server-rendered    | Cookie + middleware       |

The select is the same in every case. Only the `v-model:value`
target and the `@change` body change.

---

Lily™ and Lily Design System™ are trademarks.
