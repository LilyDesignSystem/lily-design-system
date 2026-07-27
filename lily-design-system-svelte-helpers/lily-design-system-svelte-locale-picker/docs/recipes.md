# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want more
error handling.

## Detect the user's language on first visit

```svelte
<LocaleChooser
  label="Language"
  locales={["en", "fr", "ar"]}
  detectFromNavigator
  storageKey="app-locale"
/>
```

Detection sits below storage, so an explicit choice wins on later
visits. It tries an exact `navigator.languages` match first, then a
language-only match (`"fr-CA"` → `"fr"`).

To use the matcher directly — on the server against an
`Accept-Language` header, for instance:

```ts
import { matchNavigatorLanguage } from "../LocaleChooser.svelte";

const preferred = request.headers.get("accept-language")
  ?.split(",").map((s) => s.split(";")[0].trim()) ?? [];

matchNavigatorLanguage(preferred, ["en", "fr", "ar"]);  // "" if nothing matches
```

Then pass the result as `value` so the client does no detection at all.

## Show the active language next to the control

The closed control is one glyph, so nothing on the page states the
active language unless you state it — and here, unlike a theme select,
the user cannot infer it by looking:

```svelte
<script lang="ts">
  import LocaleChooser, { bcp47LocaleTag, localeName } from "../LocaleChooser.svelte";
  let locale = $state("");
</script>

<LocaleChooser label="Language" locales={["en", "fr", "ar"]} bind:value={locale} />

<p class="locale-chooser-status" aria-live="polite">
  Active language:
  <span lang={bcp47LocaleTag(locale)}>{localeName(locale)}</span>
</p>
```

Drop the `lang` on the span if you are showing the built-in **English**
names — see
[accessibility.md § The status region](./accessibility.md#the-status-region).

## Use endonyms instead of English names

Each language written in its own script. Strongly recommended: the
person who needs the control is the person who cannot read your default
language.

```svelte
<LocaleChooser
  label="Language"
  locales={["en", "cy", "fr", "ar", "ur", "zh_Hant"]}
  localeLabels={{
    en: "English",
    cy: "Cymraeg",
    fr: "Français",
    ar: "العربية",
    ur: "اردو",
    zh_Hant: "繁體中文",
  }}
/>
```

Remember that typeahead matches the label, so with endonyms a user
types "Cy" for Welsh, not "We".

## Wire an i18n library

```svelte
<LocaleChooser
  label="Language"
  locales={["en", "fr", "ar"]}
  bind:value={current}
  onChange={(code) => i18nLocale.set(code)}
  storageKey="app-locale"
/>
```

`onChange` receives the consumer-form code, so it round-trips into
whatever form your library expects. Full patterns for `svelte-i18n`,
Paraglide, Inlang, and raw `Intl.*`:
[i18n-integration.md](./i18n-integration.md).

## Read a locale cookie before render (SvelteKit)

See [ssr.md](./ssr.md) and
[`../examples/ssr-cookie.svelte`](../examples/ssr-cookie.svelte) for
the full recipe. The shape is: resolve the cookie in
`hooks.server.ts`, substitute `lang` and `dir` into `app.html` with
`transformPageChunk`, forward the code through a layout `load`, and
pass it as `value`.

## Migrate from localStorage-only to cookie-backed

1. Keep `storageKey` for now so existing users don't lose their
   preference.
2. In `onChange`, also `fetch("/api/locale", { method: "POST", … })`
   to write the cookie.
3. On the server, prefer the cookie. On the client, prefer the
   server-supplied value via `value`, which short-circuits the storage
   read.

Worth doing for a locale select specifically: a client-only preference
means the first paint is always in the wrong language for a returning
user, and the flash is far more disruptive than a theme flash.

## Scope a locale to one region

```svelte
<section bind:this={panel}>
  <LocaleChooser
    label="Panel language"
    locales={["en", "fr", "ar"]}
    target={panel}
    bind:value={panelLocale}
  />
</section>
```

`<html>` keeps the document language; the section gets `lang` and
`dir`. The page as a whole still needs a correct document `lang` for
WCAG 3.1.1 — do not use `target` to avoid setting it. Working example:
[`../examples/scoped-target.svelte`](../examples/scoped-target.svelte).

## Manage `dir` yourself

```svelte
<LocaleChooser label="Language" locales={["en", "ar"]} applyDir={false} />
```

The select then writes only `lang`, and never touches `dir` — not even
to clear a stale one. Use `isRtlLocale` to compute direction wherever
you do handle it:

```ts
import { isRtlLocale } from "../LocaleChooser.svelte";
document.documentElement.dir = isRtlLocale(code) ? "rtl" : "ltr";
```

## Offer all 436 built-in locales

```svelte
<script lang="ts">
  import LocaleChooser, { defaultLocaleLabels } from "../LocaleChooser.svelte";
  const ALL = Object.keys(defaultLocaleLabels);
</script>

<LocaleChooser label="Language" locales={ALL} bind:value={locale} />
```

Do this only if you mean it. A 436-item listbox is a long scroll even
with typeahead, and offering a language the app has no translations for
is worse than not offering it. `locales` should be the set the app
actually supports; the built-in table is a *label* source, not a menu.

If you genuinely need to pick from hundreds, an APG Combobox with a
text input is the right pattern, and it is not this component — see
[custom-rendering.md](./custom-rendering.md#what-the-snippet-should-not-do).

## Style the flyout

The control **is** a button-triggered flyout. What it does not ship is
the CSS that positions the popup — and for this control the positioning
must use logical properties, since selecting an RTL locale flips the
page. See
[styling.md § Positioning the listbox](./styling.md#positioning-the-listbox).

## Pair with theme-chooser in a header

The two helpers are deliberately symmetric — same DOM shape, same
keyboard contract, same glyph treatment (monochrome, `aria-hidden`,
one-glyph-wide button). Rendered side by side they read as one set:

```svelte
<ThemeChooser label="Theme" {themesUrl} {themes} bind:value={theme} />
<LocaleChooser label="Language" {locales} bind:value={locale} />
```

One shared block of CSS can style both, since the hooks differ only in
prefix. If the globe renders blue next to the monochrome `◑`, the
variation selector is not taking effect on that platform — pin a
text-presentation font on `.locale-chooser-icon`, or swap in an SVG.

---

Lily™ and Lily Design System™ are trademarks.
