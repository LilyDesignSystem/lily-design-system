# Recipes

Task-shaped solutions built from the macro, the client module, and the
exported pure helpers. Each is self-contained.

## Show the active language next to the control

The closed button shows a glyph and never the active locale, so the
active locale is not discoverable from the control by anyone — sighted
or not. Pair it with a status region. This is the default pattern, not
an enhancement; see [accessibility.md](./accessibility.md).

```njk
{{ localeChooser({ label: "Language", locales: LOCALES, localeLabels: NATIVE }) }}
<p class="locale-chooser-status" aria-live="polite"></p>
```

```js
import { autoInit, localeName } from "./locale-chooser.client.js";

const status = document.querySelector(".locale-chooser-status");
autoInit({
    onChange(code) {
        status.textContent = `Active language: ${localeName(code)}`;
    },
});
```

`aria-live="polite"` announces mutations only, so the region is silent
on first paint and speaks on each subsequent change. That is intended:
a page that announces its own language on load is noise.

`localeName` resolves *English* names from the built-in table, which
suits an English-language page. For endonyms, look up your own
`localeLabels` map instead.

## Persist the choice, but let the server win

Set `storageKey` for persistence and pass `value` when the request
already resolved a locale. `value` outranks storage, so a
server-resolved locale — from a cookie, a signed-in profile, a URL
prefix — is never overridden by a stale local entry, while a visitor
with no server signal still lands on their saved choice.

```njk
{{ localeChooser({
    label: "Language",
    locales: LOCALES,
    value: serverResolvedLocale,
    storageKey: "my-app:locale"
}) }}
```

Namespace the key per application: `localStorage` is shared across the
whole origin.

## Resolve the locale on the server from a cookie

The flicker-free path, and the reason this catalog renders
server-side. Read the cookie in your request handler, pass it as
`value`, and write it back from `onChange`.

```js
// Express-ish
app.get("/*", (req, res) => {
    const locale = req.cookies.locale || "en";
    res.send(nunjucks.render("page.njk", { locale }));
});
```

```js
autoInit({
    onChange(code) {
        document.cookie = `locale=${encodeURIComponent(code)};path=/;max-age=31536000;samesite=lax`;
    },
});
```

Now the server renders `<html lang>` and the pre-filled hidden input
correctly on the first byte, and the client's initial `applyLocale` is
a no-op re-application rather than a correction. Full walkthrough in
[ssr.md](./ssr.md); a runnable version in
[`../examples/08-ssr-cookie.njk`](../examples/08-ssr-cookie.njk).

## Reformat dates and numbers when the locale changes

The helper applies `lang` and `dir`; it deliberately does not format
anything. Wire `Intl` yourself in `onChange`.

```js
import { autoInit, bcp47LocaleTag } from "./locale-chooser.client.js";

function reformat(code) {
    const tag = bcp47LocaleTag(code); // "en_US" -> "en-US"
    for (const el of document.querySelectorAll("[data-date]")) {
        el.textContent = new Intl.DateTimeFormat(tag, {
            dateStyle: "long",
        }).format(new Date(el.dataset.date));
    }
}

autoInit({ onChange: reformat });
```

Always pass the hyphenated form to `Intl.*`. An underscored `"en_US"`
throws a `RangeError`. More in [i18n-integration.md](./i18n-integration.md)
and [`../examples/07-with-intl.njk`](../examples/07-with-intl.njk).

## Reload into a locale-prefixed URL

For sites where the locale lives in the path (`/en/about`, `/fr/about`)
— the Eleventy i18n plugin shape — the control's job is navigation, not
DOM mutation.

```js
autoInit({
    onChange(code) {
        const segments = location.pathname.split("/");
        segments[1] = code;               // swap the locale segment
        location.assign(segments.join("/"));
    },
});
```

Persistence is usually unnecessary here: the URL *is* the state. Pass
the current locale as `value` from your template data so the control
renders in agreement with the page it is on.

Guard against navigating to the page you are already on if you also
call this from a "sync on load" path — an unconditional `assign` in a
handler that fires on init is a reload loop.

## Scope the applied locale to part of the page

By default `lang` and `dir` go on `document.documentElement`. Pass
`target` to `initLocaleChooser` to scope them to a region instead —
useful for a preview pane, or an embedded widget that must not
relayout its host.

```js
import { initLocaleChooser } from "./locale-chooser.client.js";

initLocaleChooser(document.querySelector("#preview-switcher"), {
    target: document.querySelector("#preview"),
});
```

Note the tradeoff: with a scoped target, the document root keeps its
original `lang`, so WCAG 3.1.1 (Language of Page) is still satisfied by
whatever your page shell set — and the scoped region is correctly
marked as a Language of Parts. That is a valid structure, but only if
the shell's `lang` is genuinely right for the rest of the page. See
[`../examples/09-scoped-target.njk`](../examples/09-scoped-target.njk).

## Let something else own `dir`

If a framework, CMS shell, or your own script already manages
direction, set `applyDir: false` so the two do not fight, and apply the
answer where you want it:

```njk
{{ localeChooser({ label: "Language", locales: LOCALES, applyDir: false }) }}
```

```js
import { autoInit, isRtlLocale } from "./locale-chooser.client.js";

autoInit({
    onChange(code) {
        myLayoutStore.setDirection(isRtlLocale(code) ? "rtl" : "ltr");
    },
});
```

`isRtlLocale` stays exported and correct either way. See
[rtl.md](./rtl.md).

## Offer a navigator-based first guess without hijacking the page

`detectFromNavigator` is off by default because `navigator.languages`
usually reflects an OS default rather than a decision the user made.
When you want to act on it without silently switching the page, do not
enable the opt — surface a dismissible offer instead:

```js
import { autoInit, matchNavigatorLanguage, localeName } from "./locale-chooser.client.js";

const controllers = autoInit();
const guess = matchNavigatorLanguage(
    Array.from(navigator.languages || []),
    LOCALES,
);

if (guess && guess !== document.documentElement.lang) {
    showBanner(`View this page in ${localeName(guess)}?`, () => {
        controllers.forEach((c) => c.setLocale(guess));
    });
}
```

The pure helper is exported precisely so detection can be used without
the automatic behaviour. If you do have an `Accept-Language` header,
prefer resolving server-side and passing `value` — same signal, no
flicker, and it lands before first paint.

## Two switchers on one page

Instances that share a `name` also share the default id prefix, which
means duplicate ids and broken `aria-controls`. Give them distinct
names, or distinct explicit ids:

```njk
{{ localeChooser({ label: "Language", locales: LOCALES, name: "locale-header" }) }}
{{ localeChooser({ label: "Language", locales: LOCALES, name: "locale-footer" }) }}
```

Both will apply to the same target and stay consistent, because each
runs `applyLocale` against the document root. What they will *not* do is
update each other's `aria-selected` — each client instance snapshots its
own options. If both are visible at once, drive them together from a
single `onChange` calling `setLocale` on the other controller, or
prefer one control plus a status region.

## See also

- [macro-opts-reference.md](./macro-opts-reference.md) — every opt.
- [i18n-integration.md](./i18n-integration.md) — Eleventy i18n,
  `Intl.*`, i18next, ICU MessageFormat.
- [ssr.md](./ssr.md) — the server-side story in full.
- [troubleshooting.md](./troubleshooting.md) — when a recipe misfires.
