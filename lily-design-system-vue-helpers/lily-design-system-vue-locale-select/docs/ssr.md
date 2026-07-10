# SSR — Server-side rendering, cookies, and Accept-Language

The select compiles cleanly under Vue 3 SSR (Nuxt 3, plain
`vue/server-renderer`, Astro Vue islands, Vite + Vue with a custom
SSR setup) but renders nothing locale-specific on the server unless
the consumer pre-resolves the locale. This page covers the four
resolution strategies, ordered by quality.

## TL;DR

| Strategy                | Flash of default locale?  | Survives reload?      | SEO-friendly? |
| ----------------------- | ------------------------- | --------------------- | ------------- |
| `detectFromNavigator`   | yes (until client mounts) | only if `storageKey`  | no            |
| `localStorage`          | yes (until client mounts) | yes                   | no            |
| Cookie (`useCookie`)    | **no**                    | yes                   | no            |
| URL prefix (`/fr/about`)| **no**                    | yes                   | **yes**       |

Use the **cookie** strategy unless you need SEO-distinct pages per
locale; then use **URL prefix**.

---

## Why SSR matters here

Nuxt 3 (and Vite + Vue SSR, Astro Vue islands) render the HTML on
the server before the JS bundle hydrates. If your `<html>` arrives
with `lang="en"` and the client picks `ar`, the page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints English page (FOUC-style flash).
3. JS hydrates, `LocaleSelect` runs its `onMounted` hook, reads
   `localStorage["app-locale"] === "ar"`, writes
   `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. The select can't avoid it on its
own because `localStorage` and `navigator.languages` aren't
accessible server-side. The consumer fixes it by pre-resolving the
locale on the server and seeding `value`.

---

## Strategy 1: Nuxt 3 `useCookie()` (recommended)

`useCookie()` is server-aware: it reads the request cookie during
SSR and writes to `document.cookie` on the client. Combined with
`useHead({ htmlAttrs })` it delivers a flicker-free first paint.

### Layout / `app.vue`

```vue
<script setup lang="ts">
import { computed } from "vue";
import LocaleSelect, {
    isRtlLocale,
    bcp47LocaleTag,
} from "@/lib/LocaleSelect.vue";

// useCookie() is auto-imported in Nuxt 3. Reads the server-side
// cookie on the first request; survives reloads.
const locale = useCookie<string>("locale", {
    default: () => "en",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
});

const langTag = computed(() => bcp47LocaleTag(locale.value));
const direction = computed(() =>
    isRtlLocale(locale.value) ? "rtl" : "ltr",
);

// useHead lets Nuxt render <html lang="…" dir="…"> in the SSR
// response, before any JS runs.
useHead({
    htmlAttrs: { lang: langTag, dir: direction },
});
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
    />
    <NuxtPage />
</template>
```

Result:

- First paint: `<html lang="fr" dir="ltr">` arrives in the HTML
  response. No flash, no layout shift.
- Select mounts already showing the right option selected because
  `locale.value` was hydrated from the cookie.
- User picks `ar`. `useCookie()` writes `document.cookie` and the
  select writes `<html lang="ar" dir="rtl">`. Next request re-paints
  the page in Arabic from the very first byte.

### Why `useCookie()` is the cleanest answer

Unlike `useState` (in-memory only) or a raw `document.cookie`
write, `useCookie()` round-trips through the request automatically.
There is no separate plugin / middleware to keep in sync. The same
ref is the SSR seed and the client mutable.

---

## Strategy 2: Nuxt 3 `useState()` with explicit middleware

When you want the server to **derive** the locale from
`Accept-Language` (not just a cookie), pair `useState()` with a
server middleware that picks the locale per-request.

### Server middleware

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
    event.context.locale =
        cookie ??
        pickFromAcceptLanguage(getRequestHeader(event, "accept-language"));
});
```

### Plugin to forward the resolved value to the client

```ts
// plugins/locale.ts
export default defineNuxtPlugin(() => {
    const event = useRequestEvent();
    const initial =
        (event?.context as { locale?: string } | undefined)?.locale ?? "en";
    return { provide: { initialLocale: initial } };
});
```

### Layout

```vue
<script setup lang="ts">
import { computed } from "vue";
import LocaleSelect, {
    isRtlLocale,
    bcp47LocaleTag,
} from "@/lib/LocaleSelect.vue";

const { $initialLocale } = useNuxtApp() as unknown as {
    $initialLocale: string;
};

// useState() hoists the ref above the tree and is hydration-safe.
const locale = useState<string>("locale", () => $initialLocale);

useHead({
    htmlAttrs: {
        lang: computed(() => bcp47LocaleTag(locale.value)),
        dir: computed(() => (isRtlLocale(locale.value) ? "rtl" : "ltr")),
    },
});

async function persistLocaleCookie(code: string) {
    if (import.meta.client) {
        document.cookie =
            `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }
}
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
        @change="persistLocaleCookie"
    />
    <NuxtPage />
</template>
```

This pattern is best when you need richer server-side resolution
than a single cookie can express (Accept-Language fallback, A/B
buckets, user-profile preference from a DB).

---

## Strategy 3: URL prefix (SEO-friendly)

URLs like `/en/about` and `/fr/about` are crawlable by search
engines and shareable as locale-specific links. The pattern uses a
Nuxt dynamic segment.

```
pages/
├── [locale]/
│   ├── index.vue
│   └── about.vue
```

```vue
<!-- layouts/default.vue -->
<script setup lang="ts">
import { computed } from "vue";
import LocaleSelect from "@/lib/LocaleSelect.vue";

const route = useRoute();
const router = useRouter();

const current = computed(() => String(route.params.locale ?? "en"));

function navigate(next: string) {
    const newPath = String(route.path).replace(
        /^\/(en|fr|ar)/,
        `/${next}`,
    );
    router.push(newPath);
}
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        :value="current"
        @change="navigate"
    />
    <slot />
</template>
```

Set `<html lang dir>` from `route.params.locale` in the same way as
Strategy 1 (or via a server-side middleware that inspects the
request URL).

---

## Strategy 4: client-only (`localStorage` / navigator)

The fallback when there is no server. The select flickers (default
paints first, then the resolved locale takes over) but everything
else works.

```vue
<LocaleSelect
    label="Language"
    :locales="['en', 'fr', 'ar']"
    v-model:value="locale"
    storage-key="app-locale"
    detect-from-navigator
/>
```

Acceptable for:

- Vite + Vue SPAs with no SSR.
- Storybook / docs sites where the flash is invisible.
- Embedded widgets inside another app where the host owns `<html>`.

---

## Hydration considerations

Vue's hydration matcher compares the SSR DOM to the client virtual
DOM and warns on any mismatch. The select is safe by default
because:

- `onMounted` never fires during SSR, so no DOM writes happen
  server-side.
- The `<option>`'s `selected` state is rendered from `value`, which
  the consumer controls and which is identical on both sides as
  long as it's seeded from the same source (cookie / route param /
  server-resolved state).

The two cases that produce hydration warnings:

1. The server rendered with `value=""` (no option selected), but the
   client `onMounted` resolved `value="fr"` from `localStorage`. The
   first paint sees no selection; hydration sees one. Fix by
   pre-seeding `value` on the server.
2. The consumer uses `:value="someServerOnlyComputed"` whose result
   differs between SSR and client. Fix by ensuring the source is
   serialisable across the boundary (cookie, route param,
   `useState`, payload).

---

## Plain `vue/server-renderer`

```ts
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import LocaleSelect from "./LocaleSelect.vue";

const app = createSSRApp(LocaleSelect, {
    label: "Language",
    locales: ["en", "fr", "ar"],
    value: "fr",
});
const html = await renderToString(app);
// html contains <select …> with the "fr" option selected.
```

The resulting string contains the rendered `<select>` with the `fr`
option `selected`. No DOM is touched on the server.

---

## Astro Vue islands

```astro
---
const locale = Astro.cookies.get("locale")?.value ?? "en";
const RTL = /^(ar|he|fa|ur|ps)/.test(locale);
---
<html lang={locale} dir={RTL ? "rtl" : "ltr"}>
    <body>
        <LocaleSelect
            client:load
            label="Language"
            :locales={["en", "fr", "ar"]}
            value={locale}
        />
        <slot />
    </body>
</html>
```

`client:load` mounts the select on the client. Because the
surrounding `<html>` already has the right `lang`/`dir`, there's no
flash.

---

## Tests for SSR

The select's vitest suite runs in jsdom (client-side). For full SSR
tests:

- **Compile check** — `vue-tsc` will catch invalid SSR usage
  (e.g. touching `document` outside `onMounted`).
- **End-to-end** — Playwright with `page.goto(…)` and check the
  raw HTML response (`page.content()` before JS) contains
  `<html lang="fr" dir="ltr">`.
- **Snapshot** — capture the rendered HTML from
  `vue/server-renderer` for each locale, snapshot the first 200
  bytes.

The select itself has no SSR-specific code path to test beyond "the
component compiles in SSR mode and renders the selected option for
the seeded `value`". The reference test suite covers that under
jsdom by asserting that `value` controls which option is selected on
mount.

---

## References

- Nuxt 3 — `useCookie`:
  <https://nuxt.com/docs/api/composables/use-cookie>
- Nuxt 3 — `useState`:
  <https://nuxt.com/docs/api/composables/use-state>
- Nuxt 3 — `useHead`:
  <https://nuxt.com/docs/api/composables/use-head>
- Vue — `vue/server-renderer`:
  <https://vuejs.org/guide/scaling-up/ssr.html>
- MDN — `Accept-Language` header:
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language>
- RFC 4647 — Matching of Language Tags:
  <https://www.rfc-editor.org/rfc/rfc4647>
- `@formatjs/intl-localematcher` — RFC 4647 best-fit matcher:
  <https://formatjs.github.io/docs/polyfills/intl-localematcher/>
- MDN — Cookies (`document.cookie`):
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies>

---

Lily™ and Lily Design System™ are trademarks.
