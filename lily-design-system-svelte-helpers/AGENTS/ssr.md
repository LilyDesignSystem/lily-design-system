# SSR — Lily Svelte Helpers

The helpers compile cleanly under Svelte 5 SSR (SvelteKit, plain
Vite + Svelte, Astro Svelte islands). This page lists the rules they
follow so SSR + hydration stays consistent, and the SvelteKit
recipes for pre-resolving server state.

## Rules every helper follows

1. **No DOM access at the top level of the instance `<script>`.**
   Anything that touches `document.*` or `window.*` lives inside
   `$effect`.
2. **No `localStorage` read during render.** Storage is only touched
   inside `$effect`, which runs client-side only.
3. **Render is deterministic from props.** Given the same props,
   server and client produce the same HTML, avoiding hydration
   warnings.
4. **`value` is the SSR bridge.** When you want a flicker-free first
   paint, resolve the value server-side and pass it as a prop. The
   component renders the matching radio as checked on the server,
   then hydrates without any DOM swap.

## SvelteKit cookie strategy (recommended)

SvelteKit's `event.cookies` + `hooks.server.ts` is the canonical
recipe for both pickers. The end-to-end working example for the
theme picker lives under
[`lily-design-system-svelte-theme-picker/examples/sveltekit-cookie/`](../lily-design-system-svelte-theme-picker/examples/sveltekit-cookie/).

### `hooks.server.ts`

```ts
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const theme = event.cookies.get("theme") ?? "light";
    const locale = event.cookies.get("locale") ?? "en";
    event.locals.theme = theme;
    event.locals.locale = locale;
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html
                .replace("%lily.theme%", theme)
                .replace("%lily.lang%", locale)
                .replace("%lily.dir%", /^(ar|he|fa|ur)/.test(locale) ? "rtl" : "ltr"),
    });
};
```

### `app.html`

```html
<!doctype html>
<html lang="%lily.lang%" dir="%lily.dir%" data-theme="%lily.theme%">
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="/assets/themes/%lily.theme%.css" />
        %sveltekit.head%
    </head>
    <body data-sveltekit-preload-data="hover">
        <div style="display: contents">%sveltekit.body%</div>
    </body>
</html>
```

The `transformPageChunk` substitution writes `lang`, `dir`, and
`data-theme` on `<html>` plus the stylesheet `<link>` before the
first byte leaves the server. The pickers hydrate without writing
anything visible.

### `+layout.server.ts`

```ts
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => ({
    theme: locals.theme,
    locale: locals.locale,
});
```

### `+layout.svelte`

```svelte
<script lang="ts">
    import { ThemePicker } from "lily-design-system-svelte-theme-picker";
    import { LocalePicker } from "lily-design-system-svelte-locale-picker";

    let { data, children } = $props();
    let theme = $state(data.theme);
    let locale = $state(data.locale);

    function persistTheme(slug: string) {
        document.cookie = `theme=${slug}; path=/; max-age=31536000; SameSite=Lax`;
    }

    function persistLocale(code: string) {
        document.cookie = `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }
</script>

<ThemePicker
    label="Theme"
    themesUrl="/assets/themes/"
    themes={["light", "dark", "abyss"]}
    bind:value={theme}
    onChange={persistTheme}
/>

<LocalePicker
    label="Language"
    locales={["en", "fr", "ar"]}
    bind:value={locale}
    onChange={persistLocale}
/>

{@render children?.()}
```

## Form-action cookie write (alternative)

Some adopters prefer to write cookies via a SvelteKit form action so
the server controls the `Set-Cookie` header. The pattern:

```ts
// src/routes/preferences/+page.server.ts
import type { Actions } from "./$types";

export const actions: Actions = {
    theme: async ({ request, cookies }) => {
        const data = await request.formData();
        const theme = String(data.get("theme") ?? "light");
        cookies.set("theme", theme, {
            path: "/",
            httpOnly: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365,
        });
        return { success: true };
    },
};
```

`document.cookie =` from the client is simpler; the form-action path
is for adopters who want `httpOnly` cookies or a fully server-driven
preference store.

## Plain `svelte/server` (no framework)

```ts
import { render } from "svelte/server";
import ThemePicker from "./ThemePicker.svelte";

const { html } = render(ThemePicker, {
    props: {
        label: "Theme",
        themesUrl: "/themes/",
        themes: ["light", "dark"],
        value: "light",
    },
});
```

The resulting string contains the rendered fieldset with the `light`
radio checked. No DOM touched, no errors thrown.

## Astro Svelte islands

Astro hydrates Svelte components with `client:load` / `client:idle`
/ `client:visible`. The helpers work with all three. Pre-seed the
`value` prop in the Astro frontmatter so the first paint is correct:

```astro
---
const theme = Astro.cookies.get("theme")?.value ?? "light";
---
<html lang="en" data-theme={theme}>
    <head>
        <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
    </head>
    <body>
        <ThemePicker
            client:load
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark", "abyss"]}
            value={theme}
        />
        <slot />
    </body>
</html>
```

## Hydration mismatch warnings

If you see a Svelte warning like "hydration_mismatch", the most
common cause is:

- The server rendered a default `value` ("") but the client picked
  a non-empty value from `localStorage`.
- **Fix.** Resolve the value server-side (cookie) and pass it as
  `value`.

A second cause: the consumer wraps the helper in a CSR-only branch —
this isolates SSR but prevents the server from rendering anything at
all. Only skip SSR for the helper if you accept the FOUC.

## Why not auto-resolve from the cookie?

The pickers have no opinion about transport (cookie? header?
IndexedDB? URL parameter?). Cookies are the right answer for
SvelteKit, but not for Cloudflare-Workers-based hosts, embedded
contexts, or apps that already have a server-side preference store.
The pickers stay transport-agnostic and let the consumer wire the
integration.
