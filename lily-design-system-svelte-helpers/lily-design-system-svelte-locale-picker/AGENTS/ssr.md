# SSR — LocalePicker (Svelte)

The picker runs cleanly under Svelte 5 SSR (SvelteKit, plain Vite +
Svelte, Astro Svelte islands). This page lists the SvelteKit-specific
recipes; the canonical rules live in
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

A complete runnable SvelteKit example for the layout side lives in
[`../examples/08-ssr-cookie.svelte`](../examples/08-ssr-cookie.svelte);
the in-file comments show the matching `hooks.server.ts`,
`app.html`, and POST endpoint code.

## What the picker does on the server

Under SSR, `$effect` is a no-op. The picker renders:

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
pre-sets them via `transformPageChunk`.

## Why this matters

If `<html>` arrives with `lang="en"` and the client picks `ar`,
the page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints English page.
3. JS hydrates, picker's `$effect` runs, reads
   `localStorage["app-locale"] === "ar"`, writes
   `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. Fix by pre-resolving the locale
server-side.

## SvelteKit cookie recipe (recommended)

The cookie pattern uses three SvelteKit moving parts:
`hooks.server.ts`, `app.html`, and `+layout.server.ts`.

### `hooks.server.ts`

```ts
import type { Handle } from "@sveltejs/kit";

const RTL = /^(ar|he|fa|ur|ps|sd|ug|yi|iw|ji|dv|ku|ckb|mzn|ks|arc)\b/;

export const handle: Handle = async ({ event, resolve }) => {
    const locale = event.cookies.get("locale") ?? "en";
    event.locals.locale = locale;
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html
                .replace("%lily.lang%", locale)
                .replace("%lily.dir%", RTL.test(locale) ? "rtl" : "ltr"),
    });
};
```

### `app.html`

```html
<!doctype html>
<html lang="%lily.lang%" dir="%lily.dir%">
    <head>
        <meta charset="utf-8" />
        %sveltekit.head%
    </head>
    <body>%sveltekit.body%</body>
</html>
```

### `+layout.server.ts`

```ts
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => ({
    locale: locals.locale,
});
```

### `+layout.svelte`

```svelte
<script lang="ts">
    import { LocalePicker } from "lily-design-system-svelte-locale-picker";

    let { data, children } = $props();
    let locale = $state(data.locale);

    async function persistCookie(code: string) {
        await fetch("/api/locale", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ locale: code }),
        });
    }
</script>

<LocalePicker
    label="Language"
    locales={["en", "fr", "ar"]}
    bind:value={locale}
    onChange={persistCookie}
/>

{@render children?.()}
```

### POST endpoint

```ts
// src/routes/api/locale/+server.ts
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const SUPPORTED = new Set(["en", "fr", "ar"]);

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { locale } = await request.json();
    if (typeof locale !== "string" || !SUPPORTED.has(locale)) {
        return json({ error: "Unknown locale" }, { status: 400 });
    }
    cookies.set("locale", locale, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
    });
    return new Response(null, { status: 204 });
};
```

Result: first paint arrives with the right `lang` and `dir`. The
picker hydrates without writing anything visible.

## SvelteKit URL-prefix strategy

For SEO-friendly URLs (`/en/about`, `/fr/about`), use SvelteKit's
parameter-matching routes. Define `[locale]/*` route segments,
validate in middleware, and drive the picker from
`$page.params.locale`.

```svelte
<script lang="ts">
    import { page, goto } from "$app/stores";
    import { LocalePicker } from "lily-design-system-svelte-locale-picker";

    let current = $derived(String($page.params.locale ?? "en"));

    function navigate(next: string) {
        const newPath = $page.url.pathname.replace(/^\/(en|fr|ar)/, `/${next}`);
        goto(newPath);
    }
</script>

<LocalePicker
    label="Language"
    locales={["en", "fr", "ar"]}
    value={current}
    onChange={navigate}
/>
```

## SvelteKit Accept-Language strategy

If no cookie has been set yet, fall back to the request's
`Accept-Language` header:

```ts
// hooks.server.ts
import type { Handle } from "@sveltejs/kit";

const SUPPORTED = ["en", "fr", "ar"];

function pickFromAcceptLanguage(header: string | null): string {
    if (!header) return "en";
    for (const item of header.split(",")) {
        const tag = item.split(";")[0].trim().toLowerCase();
        if (SUPPORTED.includes(tag)) return tag;
        const base = tag.split("-")[0];
        if (SUPPORTED.includes(base)) return base;
    }
    return "en";
}

export const handle: Handle = async ({ event, resolve }) => {
    const cookie = event.cookies.get("locale");
    event.locals.locale = cookie ?? pickFromAcceptLanguage(
        event.request.headers.get("accept-language"),
    );
    return resolve(event);
};
```

The picker stays unchanged.

## Astro Svelte islands

```astro
---
const locale = Astro.cookies.get("locale")?.value ?? "en";
const isRtl = /^(ar|he|fa|ur)/.test(locale);
---
<html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
    <body>
        <LocalePicker
            client:load
            label="Language"
            locales={["en", "fr", "ar"]}
            value={locale}
        />
        <slot />
    </body>
</html>
```

## Hydration mismatch warnings

If you see a Svelte warning like "hydration_mismatch", the most
common cause is:

- The server rendered no `checked` on any radio (because `value`
  was empty), but the client picked a non-empty value from
  `localStorage`.
- **Fix.** Resolve the locale server-side and pass it as `value`.

## Plain `svelte/server`

```ts
import { render } from "svelte/server";
import LocalePicker from "./LocalePicker.svelte";

const { html } = render(LocalePicker, {
    props: {
        label: "Language",
        locales: ["en", "fr", "ar"],
        value: "fr",
    },
});
```

The resulting string contains the rendered fieldset with the `fr`
radio checked. No DOM touched.
