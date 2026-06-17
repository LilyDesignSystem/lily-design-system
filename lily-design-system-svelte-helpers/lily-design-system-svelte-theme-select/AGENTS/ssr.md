# SSR — ThemeSelect (Svelte)

The picker runs cleanly under Svelte 5 SSR (SvelteKit, plain Vite +
Svelte, Astro Svelte islands). This page lists the SvelteKit-specific
recipes; the canonical rules live in
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

A complete runnable SvelteKit demo lives under
[`../examples/sveltekit-cookie/`](../examples/sveltekit-cookie/). It
ships `hooks.server.ts`, an `app.html` snippet, `+layout.server.ts`,
`+layout.svelte`, `+page.svelte`, and an `api+server.ts` endpoint
for the form-action cookie write.

## What the picker does on the server

Under SSR, `$effect` is a no-op. The picker renders:

```html
<select class="theme-select" aria-label="Theme" name="theme">
    <option class="theme-select-option" value="light">Light</option>
    …
</select>
```

If the consumer passes `value="light"`, the corresponding option
gets `selected` rendered server-side.

The managed `<link>` is **not** created on the server. `data-theme`
is **not** written to `<html>` on the server. Those happen on
hydration.

## Why this matters

If `<html>` arrives with no `data-theme` and the theme CSS
references `:root[data-theme="dark"] { … }`, the first paint shows
the default browser styles, then on hydration the picker sets
`data-theme="dark"` and the page repaints. That's the flash of
unstyled theme (FOUT).

Fix: resolve the theme on the server and inline both
`<html data-theme="…">` and a `<link rel="stylesheet">` for the
chosen theme so CSS is in place before any pixel is painted.

## SvelteKit cookie recipe (recommended)

The cookie pattern uses three SvelteKit moving parts:
`hooks.server.ts`, `app.html`, and `+layout.server.ts`. The full
working source lives at
[`../examples/sveltekit-cookie/`](../examples/sveltekit-cookie/).

### `hooks.server.ts`

```ts
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const theme = event.cookies.get("theme") ?? "light";
    event.locals.theme = theme;
    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace("%lily.theme%", theme),
    });
};
```

### `app.html`

```html
<!doctype html>
<html lang="en" data-theme="%lily.theme%">
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="/assets/themes/%lily.theme%.css" />
        %sveltekit.head%
    </head>
    <body>%sveltekit.body%</body>
</html>
```

### `+layout.server.ts`

```ts
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => ({
    theme: locals.theme,
});
```

### `+layout.svelte`

```svelte
<script lang="ts">
    import { ThemeSelect } from "lily-design-system-svelte-theme-select";

    let { data, children } = $props();
    let theme = $state(data.theme);

    function persistCookie(slug: string) {
        document.cookie = `theme=${slug}; path=/; max-age=31536000; SameSite=Lax`;
    }
</script>

<ThemeSelect
    label="Theme"
    themesUrl="/assets/themes/"
    themes={["light", "dark", "abyss"]}
    bind:value={theme}
    onChange={persistCookie}
/>

{@render children?.()}
```

The picker hydrates over the pre-resolved value without writing
anything visible.

## Form-action cookie write (alternative)

Some adopters prefer to write the cookie via a SvelteKit form action
or POST endpoint so the server controls the `Set-Cookie` header. The
example's `api+server.ts` shows the endpoint shape:

```ts
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const ALLOWED = new Set(["light", "dark", "abyss"]);

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { theme } = await request.json();
    if (typeof theme !== "string" || !ALLOWED.has(theme)) {
        return json({ error: "Unknown theme" }, { status: 400 });
    }
    cookies.set("theme", theme, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
    });
    return new Response(null, { status: 204 });
};
```

`document.cookie =` from the client is simpler; the POST path is
for adopters who want `httpOnly` cookies or a fully server-driven
preference store.

## Astro Svelte islands

```astro
---
const theme = Astro.cookies.get("theme")?.value ?? "light";
---
<html lang="en" data-theme={theme}>
    <head>
        <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
    </head>
    <body>
        <ThemeSelect
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

## Plain `svelte/server` (no framework)

```ts
import { render } from "svelte/server";
import ThemeSelect from "./ThemeSelect.svelte";

export function renderApp(req) {
    const cookieTheme = parseCookie(req.headers.cookie, "theme") ?? "light";
    const { html, head } = render(ThemeSelect, {
        props: {
            label: "Theme",
            themesUrl: "/assets/themes/",
            themes: ["light", "dark", "abyss"],
            value: cookieTheme,
        },
    });
    return `<!doctype html>
<html lang="en" data-theme="${cookieTheme}">
    <head>
        ${head}
        <link rel="stylesheet" href="/assets/themes/${cookieTheme}.css" />
    </head>
    <body><div id="app">${html}</div><script src="/client.js"></script></body>
</html>`;
}
```

## Hydration mismatch warnings

If you see a Svelte warning like "hydration_mismatch", the most
common cause is:

- The server rendered no `selected` on any option (because `value`
  was empty), but the client picked a non-empty value from
  `localStorage`.
- **Fix.** Resolve the theme server-side and pass it as `value`.

A second cause: the consumer wraps the helper in a `{#if browser}`
branch — this isolates SSR but prevents the server from rendering
anything at all. Only skip SSR for the helper if you accept the
FOUC.

## Why not auto-resolve from the cookie?

The picker has no opinion about transport (cookie? header?
IndexedDB? URL parameter?). Cookies are the right answer for
SvelteKit, but not for Cloudflare-Workers-based hosts, embedded
contexts, or apps that already have a server-side preference
store. The picker stays transport-agnostic and lets the consumer
wire the integration.
