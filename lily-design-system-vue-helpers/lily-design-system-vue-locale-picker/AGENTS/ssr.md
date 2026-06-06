# SSR — LocalePicker (Vue)

The picker runs cleanly under Vue 3 SSR (Nuxt 3, plain
`vue/server-renderer`, Astro Vue islands). This page lists the
Vue-specific recipes; the canonical rules live in
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the picker does on the server

Under SSR, `onMounted` and `watch` are no-ops. The picker renders:

```html
<fieldset class="locale-picker" role="radiogroup" aria-label="Language">
    <label class="locale-picker-option" lang="en">
        <input type="radio" name="locale" value="en" />
        <span class="locale-picker-option-label">English</span>
    </label>
    …
</fieldset>
```

If the consumer passes `value="ar"`, the corresponding radio gets
`checked` rendered server-side.

The `lang` and `dir` attributes on the document root are **not**
written on the server. Those happen on hydration unless the consumer
pre-sets them via `useHead`.

## Why this matters

If `<html>` arrives with `lang="en"` and the client picks `ar`,
the page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints English page.
3. JS hydrates, picker's `onMounted` runs, reads
   `localStorage["app-locale"] === "ar"`, writes
   `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. Fix by pre-resolving the locale
server-side.

## Nuxt 3 cookie recipe (recommended)

End-to-end code lives in
[`../examples/08-ssr-cookie.vue`](../examples/08-ssr-cookie.vue).
The shape:

### Server middleware

```ts
// server/middleware/locale.ts
import { defineEventHandler, getCookie } from "h3";

export default defineEventHandler((event) => {
    const cookie = getCookie(event, "locale") ?? "en";
    event.context.locale = cookie;
});
```

### Plugin to expose the cookie value

```ts
// plugins/locale.ts
export default defineNuxtPlugin(() => {
    const event = useRequestEvent();
    const initial = (event?.context as { locale?: string } | undefined)?.locale ?? "en";
    return { provide: { initialLocale: initial } };
});
```

### Layout

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import LocalePicker, { isRtlLocale, bcp47LocaleTag } from "@/lib/LocalePicker.vue";

const { $initialLocale } = useNuxtApp() as unknown as { $initialLocale: string };
const locale = ref<string>($initialLocale);

const langTag = computed(() => bcp47LocaleTag(locale.value));
const direction = computed(() => (isRtlLocale(locale.value) ? "rtl" : "ltr"));

useHead({
    htmlAttrs: { lang: langTag, dir: direction },
});

async function persistLocaleCookie(code: string) {
    await fetch("/api/locale", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale: code }),
    });
}
</script>

<template>
    <LocalePicker
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
        @change="persistLocaleCookie"
    />
    <NuxtPage />
</template>
```

### POST endpoint

```ts
// server/api/locale.post.ts
import { defineEventHandler, readBody, setCookie } from "h3";

const SUPPORTED = new Set(["en", "fr", "ar"]);

export default defineEventHandler(async (event) => {
    const body = (await readBody<{ locale?: string }>(event)) ?? {};
    const code = String(body.locale ?? "");
    if (!SUPPORTED.has(code)) {
        event.node.res.statusCode = 400;
        return { error: "Unknown locale" };
    }
    setCookie(event, "locale", code, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
    });
    event.node.res.statusCode = 204;
    return null;
});
```

Result: first paint arrives with the right `lang` and `dir`. The
picker hydrates without writing anything visible.

## Nuxt 3 URL-prefix strategy

For SEO-friendly URLs (`/en/about`, `/fr/about`), use Nuxt's file-
based dynamic routes. Define `[locale]/*` route segments, validate
in middleware, and drive the picker from `useRoute().params.locale`.

```vue
<script setup lang="ts">
import { computed } from "vue";
import LocalePicker from "@/lib/LocalePicker.vue";

const route = useRoute();
const router = useRouter();

const current = computed(() => String(route.params.locale ?? "en"));

function navigate(next: string) {
    const newPath = String(route.path).replace(/^\/(en|fr|ar)/, `/${next}`);
    router.push(newPath);
}
</script>

<template>
    <LocalePicker
        label="Language"
        :locales="['en', 'fr', 'ar']"
        :value="current"
        @change="navigate"
    />
</template>
```

## Nuxt 3 Accept-Language strategy

If no cookie has been set yet, fall back to the request's
`Accept-Language` header:

```ts
// server/middleware/locale.ts
import { defineEventHandler, getCookie, getRequestHeader } from "h3";

const SUPPORTED = ["en", "fr", "ar"];

function pickFromAcceptLanguage(header: string | undefined): string {
    if (!header) return "en";
    for (const item of header.split(",")) {
        const tag = item.split(";")[0].trim().toLowerCase();
        if (SUPPORTED.includes(tag)) return tag;
        const base = tag.split("-")[0];
        if (SUPPORTED.includes(base)) return base;
    }
    return "en";
}

export default defineEventHandler((event) => {
    const cookie = getCookie(event, "locale");
    event.context.locale = cookie ?? pickFromAcceptLanguage(
        getRequestHeader(event, "accept-language"),
    );
});
```

The picker stays unchanged.

## Astro Vue islands

```astro
---
const locale = Astro.cookies.get("locale")?.value ?? "en";
---
<html lang={locale} dir={/^(ar|he|fa|ur)/.test(locale) ? "rtl" : "ltr"}>
    <body>
        <LocalePicker
            client:load
            label="Language"
            :locales={["en", "fr", "ar"]}
            value={locale}
        />
        <slot />
    </body>
</html>
```

## Hydration mismatch warnings

If you see a Vue warning like "Hydration node mismatch", the most
common cause is:

- The server rendered no `checked` on any radio (because `value`
  was empty), but the client picked a non-empty value from
  `localStorage`.
- **Fix.** Resolve the locale server-side and pass it as `value`.

## Plain Vue 3 SSR

```ts
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import LocalePicker from "./LocalePicker.vue";

const app = createSSRApp(LocalePicker, {
    label: "Language",
    locales: ["en", "fr", "ar"],
    value: "fr",
});
const html = await renderToString(app);
```

The resulting string contains the rendered fieldset with the `fr`
radio checked. No DOM touched.
