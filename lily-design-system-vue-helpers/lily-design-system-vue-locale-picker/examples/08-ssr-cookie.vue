<!--
    08. Nuxt 3 SSR with cookie persistence (useCookie).

    No flash of default locale: the server reads the cookie, fills
    `<html lang dir>` via useHead, and seeds the picker with `value`.
    The cookie ref is the same on server and client — selecting a new
    locale writes the cookie back automatically.

    This file is the app/layout component. The companion server-side
    pieces (middleware, plugin, POST endpoint) are shown as comments
    below; they live in their own files.

    Outcome: every request paints with the right lang/dir from byte
    zero. Choosing a locale rewrites the cookie and updates the DOM in
    the same tick.
-->
<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import LocalePicker, {
    isRtlLocale,
    bcp47LocaleTag,
} from "../LocalePicker.vue";

// In real Nuxt 3 code, useCookie and useHead are auto-imported and
// useCookie<T>() returns a Ref<T> that round-trips between server
// and client automatically. The stand-ins below let this file
// compile outside Nuxt 3 without changing the body of the script.
declare const useCookie: <T>(
    name: string,
    options?: {
        default?: () => T;
        sameSite?: "lax" | "strict" | "none";
        maxAge?: number;
    },
) => Ref<T>;
declare const useHead: (meta: {
    htmlAttrs?: { lang?: unknown; dir?: unknown };
}) => void;

// Real Nuxt 3 usage:
//   const locale = useCookie<string>("locale", { default: () => "en" });
// Demo-only fallback so the file compiles standalone:
const locale =
    typeof useCookie === "function"
        ? useCookie<string>("locale", {
              default: () => "en",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 365,
          })
        : ref("en");

const langTag = computed(() => bcp47LocaleTag(locale.value));
const direction = computed(() =>
    isRtlLocale(locale.value) ? "rtl" : "ltr",
);

// Renders <html lang="…" dir="…"> in the SSR response so the page
// arrives with the right values from the very first byte.
if (typeof useHead === "function") {
    useHead({ htmlAttrs: { lang: langTag, dir: direction } });
}
</script>

<template>
    <LocalePicker
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
    />

    <p>Selected locale: <code>{{ locale }}</code></p>

    <!--
    Companion files (place in your Nuxt 3 app):

    plugins/locale.ts ─────────────────────────────────────────────
    export default defineNuxtPlugin(() => {
        // useCookie above already round-trips between server and
        // client. A plugin is only needed when you also derive the
        // initial locale from Accept-Language, A/B buckets, or a
        // user-profile lookup.
    });

    server/middleware/locale.ts ───────────────────────────────────
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
        if (!cookie) {
            event.context.locale = pickFromAcceptLanguage(
                getRequestHeader(event, "accept-language"),
            );
        }
    });

    server/api/locale.post.ts ─────────────────────────────────────
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
-->
</template>
