<!--
    08. SvelteKit SSR with cookie persistence.

    No flash of default locale: the server reads the cookie, fills
    `<html lang dir>` placeholders in app.html, and seeds the picker
    with `value`. The picker's `onChange` writes the cookie back.

    This file is the layout component. The other three pieces are
    shown as comments below; they live in their own files.

    Outcome: every request paints with the right lang/dir from byte
    zero. Choosing a locale rewrites the cookie and updates the DOM in
    the same tick.
-->
<script lang="ts">
    import LocalePicker from "../LocalePicker.svelte";

    let { data, children } = $props<{
        data: { locale: string };
        children?: import("svelte").Snippet;
    }>();

    let locale = $state(data.locale);

    function writeCookie(code: string) {
        document.cookie =
            `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }
</script>

<LocalePicker
    label="Language"
    locales={["en", "fr", "ar"]}
    value={locale}
    bind:value={locale}
    onChange={writeCookie}
/>

{@render children?.()}

<!--
    Companion files (place in your SvelteKit app):

    src/hooks.server.ts ────────────────────────────────────────────────
    import type { Handle } from "@sveltejs/kit";

    const RTL_RE =
        /^(ar|arc|ckb|dv|fa|he|iw|ji|ks|ku|mzn|ps|sd|ug|ur|yi)\b/i;

    export const handle: Handle = async ({ event, resolve }) => {
        const locale = event.cookies.get("locale") ?? "en";
        event.locals.locale = locale;
        const dir = RTL_RE.test(locale) ? "rtl" : "ltr";
        const tag = locale.replace(/_/g, "-");
        return resolve(event, {
            transformPageChunk: ({ html }) =>
                html.replace("%lang%", tag).replace("%dir%", dir),
        });
    };

    src/app.html ───────────────────────────────────────────────────────
    <!doctype html>
    <html lang="%lang%" dir="%dir%">
        <head><meta charset="utf-8">%sveltekit.head%</head>
        <body><div>%sveltekit.body%</div></body>
    </html>

    src/routes/+layout.server.ts ───────────────────────────────────────
    import type { LayoutServerLoad } from "./$types";
    export const load: LayoutServerLoad = async ({ locals }) => ({
        locale: locals.locale,
    });
-->
