# i18n integration

`LocaleSelect` is intentionally not an i18n library. It changes the
document language and tells you when the user changed it; the actual
string substitution is your i18n library's job.

This page shows how to wire the picker to the four most common Svelte
i18n stacks: **svelte-i18n**, **Paraglide JS** (Inlang), **Tolgee**,
and **raw `Intl.*`**.

The wiring pattern is always the same:

1. Bind `value` to your i18n library's current-locale store.
2. Pass `onChange` if your library also needs an imperative call.
3. (Optionally) pre-seed `value` server-side for flicker-free SSR.

---

## svelte-i18n

[svelte-i18n](https://github.com/kaisermann/svelte-i18n) exposes a
writable `locale` store. The picker writes to it via `bind:value`.

```svelte
<script lang="ts">
    import LocaleSelect from "$lib/LocaleSelect.svelte";
    import { locale as i18nLocale, addMessages, init } from "svelte-i18n";
    import en from "$lib/messages/en.json";
    import fr from "$lib/messages/fr.json";
    import ar from "$lib/messages/ar.json";

    addMessages("en", en);
    addMessages("fr", fr);
    addMessages("ar", ar);
    init({ fallbackLocale: "en", initialLocale: "en" });
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    bind:value={$i18nLocale}
    storageKey="app-locale"
    detectFromNavigator
/>
```

The picker writes to `$i18nLocale`, which svelte-i18n watches; every
`$_("…")` call in your templates immediately re-evaluates against the
new locale.

If you need to react to the change yourself (e.g. to refetch a
locale-dependent API response), add `onChange`:

```svelte
<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    bind:value={$i18nLocale}
    onChange={(code) => refetchCalendarEvents({ locale: code })}
/>
```

---

## Paraglide JS (Inlang)

[Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)
compiles messages into tiny tree-shakeable functions and tracks
language via `setLocale()` / `getLocale()`.

```svelte
<script lang="ts">
    import LocaleSelect from "$lib/LocaleSelect.svelte";
    import { setLocale, getLocale, type Locale } from "$lib/paraglide/runtime.js";

    let current = $state<string>(getLocale());
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    bind:value={current}
    onChange={(code) => setLocale(code as Locale)}
    storageKey="paraglide-locale"
/>
```

Paraglide's message functions (e.g. `m.greeting()`) read `getLocale()`
synchronously. Wrap your template in a `{#key current}` block if you
need Svelte to re-render every node when the locale changes:

```svelte
{#key current}
    <h1>{m.greeting()}</h1>
    <p>{m.body()}</p>
{/key}
```

For SvelteKit + Paraglide's URL-based locale strategy, drive the
picker from `$page.params.locale` and `onChange` calls
`goto(\`/${code}\${$page.url.pathname.replace(/^\/[a-z-]+/, "")}\`)`
instead of `setLocale`.

---

## Tolgee

[Tolgee](https://tolgee.io/) provides a `TolgeeProvider` and a
`getLanguage()` / `changeLanguage()` API.

```svelte
<script lang="ts">
    import LocaleSelect from "$lib/LocaleSelect.svelte";
    import { getTolgeeContext } from "@tolgee/svelte";

    const { tolgee } = getTolgeeContext();
    let current = $state(tolgee.getLanguage() ?? "en");
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    bind:value={current}
    onChange={(code) => tolgee.changeLanguage(code)}
    storageKey="tolgee-locale"
/>
```

Tolgee handles message loading and re-render internally; the picker
only needs to call `changeLanguage`.

---

## Raw `Intl.*`

For apps with a handful of strings and no formal i18n library, store
the locale in a `$state` rune and pass it to `Intl` formatters
directly. The picker still owns the `lang` / `dir` lifecycle:

```svelte
<script lang="ts">
    import LocaleSelect from "$lib/LocaleSelect.svelte";

    let locale = $state("en");

    const dateFmt = $derived(new Intl.DateTimeFormat(locale, { dateStyle: "long" }));
    const numFmt = $derived(new Intl.NumberFormat(locale));
    const currencyFmt = $derived(
        new Intl.NumberFormat(locale, { style: "currency", currency: "GBP" }),
    );

    const today = new Date();
    const balance = 1234.56;
</script>

<LocaleSelect
    label="Language"
    locales={["en", "en-US", "fr", "fr-CA", "ar"]}
    bind:value={locale}
    storageKey="app-locale"
/>

<p>Today: {dateFmt.format(today)}</p>
<p>Balance: {currencyFmt.format(balance)}</p>
<p>Population: {numFmt.format(67_330_000)}</p>
```

`Intl.*` formatters accept both `en_US` and `en-US`; they normalise
internally. The bindable `value` works either way.

---

## SvelteKit URL-prefix strategies

If your app uses URL-prefixed locales (`/en/about`, `/fr/about`), the
picker's `onChange` calls `goto`:

```svelte
<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import LocaleSelect from "$lib/LocaleSelect.svelte";

    let current = $derived(page.params.locale ?? "en");

    function navigateToLocale(next: string) {
        const path = page.url.pathname.replace(/^\/[a-z-]+/, `/${next}`);
        goto(path, { invalidateAll: true });
    }
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    value={current}
    bind:value={current}
    onChange={navigateToLocale}
/>
```

`value={current}` (one-way) + `bind:value={current}` (two-way) means
the picker reflects the URL on every navigation but also writes back
when the user picks a new locale. The `goto` call invalidates loaders
so the new locale's data fetches re-run.

---

## Cookie-based persistence (server)

`localStorage` persistence flickers on first paint because the server
renders the default locale before the client reads storage. Prefer a
cookie when you have a SvelteKit server:

```ts
// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const locale = event.cookies.get("locale") ?? "en";
    event.locals.locale = locale;
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace("%lang%", locale).replace(
                "%dir%",
                /^(ar|he|fa|ur|ps|sd)/.test(locale) ? "rtl" : "ltr",
            ),
    });
};
```

```html
<!-- src/app.html -->
<!doctype html>
<html lang="%lang%" dir="%dir%">
    …
</html>
```

```svelte
<!-- +layout.svelte -->
<script lang="ts">
    let { data, children } = $props();
    let locale = $state(data.locale);
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    value={locale}
    bind:value={locale}
    onChange={(code) => {
        document.cookie = `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }}
/>

{@render children?.()}
```

The page arrives with the correct `lang` and `dir` already on
`<html>`, no flash. See [./ssr.md](./ssr.md) for more.

---

## Picking the right strategy

| Need                                       | Strategy                  |
| ------------------------------------------ | ------------------------- |
| One small SPA, English + French only       | Raw `Intl.*`              |
| ICU MessageFormat, plurals, gender         | svelte-i18n               |
| Tree-shaken type-safe messages, edge SSR   | Paraglide JS              |
| Translator CMS, live editing, screenshots  | Tolgee                    |
| SEO-friendly URLs per locale               | SvelteKit URL prefix      |
| No FOUC, cookie-backed, server-rendered    | Cookie + `hooks.server.ts`|

The picker is the same in every case. Only the `bind:value` target and
the `onChange` body change.
