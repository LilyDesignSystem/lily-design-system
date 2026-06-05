# SSR — Server-side rendering, cookies, and Accept-Language

The picker compiles cleanly under SSR but renders nothing locale-
specific on the server unless the consumer pre-resolves the locale.
This page covers the three resolution strategies, ordered by quality.

## TL;DR

| Strategy                | Flash of default locale?  | Survives reload?      | SEO-friendly? |
| ----------------------- | ------------------------- | --------------------- | ------------- |
| `detectFromNavigator`   | yes (until client mounts) | only if `storageKey`  | no            |
| `localStorage`          | yes (until client mounts) | yes                   | no            |
| Cookie                  | **no**                    | yes                   | no            |
| URL prefix (`/fr/about`)| **no**                    | yes                   | **yes**       |

Use the **cookie** strategy unless you need SEO-distinct pages per
locale; then use **URL prefix**.

---

## Why SSR matters here

SvelteKit (and Next + Svelte islands, Astro + Svelte, etc.) render the
HTML on the server before the JS bundle hydrates. If your `<html>`
arrives with `lang="en"` and the client picks `ar`, the page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints English page (FOUC-style flash).
3. JS hydrates, `LocalePicker` runs its $effect, reads
   `localStorage["app-locale"] === "ar"`, writes
   `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. The picker can't avoid it on its own
because `localStorage` and `navigator.languages` aren't accessible
server-side. The consumer fixes it by pre-resolving the locale on the
server and seeding `value`.

---

## Strategy 1: cookie (recommended)

A cookie survives reloads, is readable on every request, and avoids
the flash. The pattern has three pieces.

### Server hook

Read the cookie on every request; default to `en`.

```ts
// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";

const RTL_RE = /^(ar|arc|ckb|dv|fa|he|iw|ji|ks|ku|mzn|ps|sd|ug|ur|yi)\b/i;

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
```

### Template placeholders

```html
<!-- src/app.html -->
<!doctype html>
<html lang="%lang%" dir="%dir%">
    <head>
        <meta charset="utf-8" />
        %sveltekit.head%
    </head>
    <body data-sveltekit-preload-data="hover">
        <div>%sveltekit.body%</div>
    </body>
</html>
```

### Layout load function

Expose the cookie value to every page via `+layout.server.ts`:

```ts
// src/routes/+layout.server.ts
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => ({
    locale: locals.locale,
});
```

### Layout component

Seed the picker with the server-resolved value and write the cookie on
change:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import LocalePicker from "$lib/LocalePicker.svelte";

    let { data, children } = $props();
    let locale = $state(data.locale);
</script>

<LocalePicker
    label="Language"
    locales={["en", "fr", "ar"]}
    value={locale}
    bind:value={locale}
    onChange={(code) => {
        document.cookie =
            `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }}
/>

{@render children?.()}
```

Result:

- First paint: `<html lang="fr" dir="ltr">` arrives in the HTML
  response. No flash, no layout shift.
- Picker mounts already showing the right radio checked.
- User picks `ar`. Picker writes `<html lang="ar" dir="rtl">`,
  callback writes the cookie. Next request re-paints the page in
  Arabic from the very first byte.

---

## Strategy 2: URL prefix

URLs like `/en/about` and `/fr/about` are crawlable by search engines
and shareable as locale-specific links. The pattern uses a dynamic
route segment.

```
src/routes/
├── [[locale=lang]]/
│   ├── +layout.server.ts
│   ├── +layout.svelte
│   └── about/+page.svelte
└── params/lang.ts
```

```ts
// src/params/lang.ts — only match known locale codes
import type { ParamMatcher } from "@sveltejs/kit";
export const match: ParamMatcher = (param) =>
    ["en", "fr", "ar"].includes(param);
```

```ts
// src/routes/[[locale=lang]]/+layout.server.ts
export const load = async ({ params }) => ({
    locale: params.locale ?? "en",
});
```

```svelte
<!-- src/routes/[[locale=lang]]/+layout.svelte -->
<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import LocalePicker from "$lib/LocalePicker.svelte";

    let { data, children } = $props();
    let locale = $state(data.locale);

    function navigate(next: string) {
        const path = page.url.pathname.replace(/^\/(en|fr|ar)/, `/${next}`);
        goto(path, { invalidateAll: true });
    }
</script>

<LocalePicker
    label="Language"
    locales={["en", "fr", "ar"]}
    value={locale}
    bind:value={locale}
    onChange={navigate}
/>

{@render children?.()}
```

The `app.html` still needs `%lang%` / `%dir%` substitution like in
Strategy 1; populate them from `params.locale` in a hook.

---

## Strategy 3: Accept-Language fallback

If you don't have a cookie yet (first visit), use the request's
`Accept-Language` header to pick a default:

```ts
// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";

const SUPPORTED = ["en", "fr", "ar"];

function pickFromAcceptLanguage(header: string | null): string {
    if (!header) return SUPPORTED[0];
    for (const item of header.split(",")) {
        const tag = item.split(";")[0].trim().toLowerCase();
        if (SUPPORTED.includes(tag)) return tag;
        const base = tag.split("-")[0];
        if (SUPPORTED.includes(base)) return base;
    }
    return SUPPORTED[0];
}

export const handle: Handle = async ({ event, resolve }) => {
    const cookie = event.cookies.get("locale");
    const locale = cookie ?? pickFromAcceptLanguage(
        event.request.headers.get("accept-language"),
    );
    event.locals.locale = locale;
    /* …rest like Strategy 1… */
};
```

The picker is unchanged — same `value`/`bind:value` pattern.

If you need RFC 4647-quality negotiation, replace the loop with the
`negotiator` npm package or the standards-compliant
`@formatjs/intl-localematcher`.

---

## Strategy 4: client-only (`localStorage` / navigator)

The fallback when there is no server. The picker flickers (default
paints first, then the resolved locale takes over) but everything
else works.

```svelte
<LocalePicker
    label="Language"
    locales={["en", "fr", "ar"]}
    bind:value={locale}
    storageKey="app-locale"
    detectFromNavigator
/>
```

Acceptable for:

- SPAs with no SSR.
- Storybook / docs sites where the flash is invisible.
- Embedded widgets inside another app where the host owns `<html>`.

---

## Streaming SSR considerations

SvelteKit's streaming responses don't replay placeholder substitutions
after the initial chunk. Use Strategy 1 (cookie + `transformPageChunk`)
which runs on the first chunk, then any streamed-in markup inherits
the correct direction because `<html>` already has it.

If you stream individual components with their own bidi behaviour
(e.g. a chat panel), wrap each with explicit `lang` and `dir` so the
streamed fragment doesn't get the wrong inherited direction during the
race.

---

## Tests for SSR

The picker's vitest suite runs in jsdom (client-side). For full SSR
tests:

- **Compile check** — `svelte-check` will catch invalid SSR usage
  (e.g. touching `document` outside `$effect`).
- **End-to-end** — Playwright with `page.goto(…)` and check the
  raw HTML response (`page.content()` before JS) contains
  `<html lang="fr" dir="ltr">`.
- **Snapshot** — capture `app.html` after `transformPageChunk` runs
  for each locale, snapshot the first 200 bytes.

The picker itself has no SSR-specific code path to test beyond "the
component compiles in SSR mode and renders the checked radio for the
seeded `value`". The reference test suite covers that under jsdom by
asserting that `value` controls which radio is checked on mount.

---

## References

- SvelteKit hooks — `transformPageChunk`:
  <https://svelte.dev/docs/kit/hooks#Server-hooks-transformPageChunk>
- MDN — `Accept-Language` header:
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language>
- RFC 4647 — Matching of Language Tags:
  <https://www.rfc-editor.org/rfc/rfc4647>
- `@formatjs/intl-localematcher` — RFC 4647 best-fit matcher:
  <https://formatjs.github.io/docs/polyfills/intl-localematcher/>
- MDN — Cookies (`document.cookie`):
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies>
