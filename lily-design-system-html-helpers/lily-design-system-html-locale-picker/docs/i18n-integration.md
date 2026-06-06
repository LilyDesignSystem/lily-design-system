# i18n integration

`<locale-picker>` is intentionally not an i18n library. It changes
the document language and tells you when the user changed it; the
actual string substitution is your i18n library's job.

This page shows how to wire the picker to the most common vanilla
HTML / JavaScript i18n stacks: **native `Intl.*`**, **FormatJS
IntlMessageFormat**, generic **message-format libraries**, **gettext
via JS**, and a manual **vanilla state-management** pattern with
`localechange` events.

The wiring pattern is always the same:

1. Listen for the `localechange` `CustomEvent` on the picker (or any
   ancestor — the event bubbles).
2. In the handler, swap your i18n library's current-locale store and
   re-render any DOM that depends on it.
3. (Optionally) pre-seed the `value` attribute server-side for
   flicker-free SSR.

---

## Native `Intl.*`

For apps with a handful of strings and no formal i18n library, store
the locale in a JS variable and pass it to `Intl` formatters every
time you format something. The picker still owns the `lang` / `dir`
lifecycle:

```html
<locale-picker
    label="Language"
    locales="en,en-US,fr,fr-CA,ar"
    storage-key="app-locale"
></locale-picker>

<p>Today: <span id="today">—</span></p>
<p>Balance: <span id="balance">—</span></p>
<p>Population: <span id="population">—</span></p>

<script type="module">
    await customElements.whenDefined("locale-picker");
    const picker = document.querySelector("locale-picker");

    function format(locale) {
        const dateFmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
        const numFmt = new Intl.NumberFormat(locale);
        const currencyFmt = new Intl.NumberFormat(locale, {
            style: "currency",
            currency: "GBP",
        });

        document.querySelector("#today").textContent = dateFmt.format(new Date());
        document.querySelector("#balance").textContent = currencyFmt.format(1234.56);
        document.querySelector("#population").textContent = numFmt.format(67_330_000);
    }

    format(picker.value);
    picker.addEventListener("localechange", (e) => format(e.detail.locale));
</script>
```

`Intl.*` formatters accept both `en_US` and `en-US`; they normalise
internally. The bindable `value` works either way.

---

## FormatJS IntlMessageFormat

[FormatJS](https://formatjs.github.io/docs/intl-messageformat/) ships
the standards-compliant ICU MessageFormat compiler. Load it via CDN
and feed it the current locale on every `localechange`:

```html
<script type="module">
    import IntlMessageFormat from "https://cdn.jsdelivr.net/npm/intl-messageformat@10/+esm";
    await customElements.whenDefined("locale-picker");

    const messages = {
        en: { greeting: "Hello, {name}! You have {count, plural, one {# message} other {# messages}}." },
        fr: { greeting: "Bonjour, {name} ! Vous avez {count, plural, one {# message} other {# messages}}." },
        ar: { greeting: "مرحبا {name}! لديك {count, plural, one {# رسالة} other {# رسالة}}." },
    };

    function render(locale) {
        const fmt = new IntlMessageFormat(
            messages[locale] ?? messages.en,
            locale,
        );
        document.querySelector("#greeting").textContent =
            fmt.format({ name: "Alex", count: 3 });
    }

    const picker = document.querySelector("locale-picker");
    render(picker.value);
    picker.addEventListener("localechange", (e) => render(e.detail.locale));
</script>
```

FormatJS handles plurals, gender, number / date / time formatting in
one library; the picker only needs to fire the change event.

---

## Generic message-format libraries

The same wiring pattern fits every JS i18n library:
[i18next](https://www.i18next.com/),
[Polyglot.js](https://airbnb.io/polyglot.js/),
[LinguiJS](https://lingui.dev/),
[Fluent](https://projectfluent.org/),
[Tolgee web SDK](https://tolgee.io/),
[messageformat.js](https://messageformat.github.io/messageformat/).

### i18next

```html
<script type="module">
    import i18next from "https://cdn.jsdelivr.net/npm/i18next@23/+esm";
    await customElements.whenDefined("locale-picker");

    await i18next.init({
        lng: "en",
        resources: {
            en: { translation: { welcome: "Welcome" } },
            fr: { translation: { welcome: "Bienvenue" } },
            ar: { translation: { welcome: "أهلا وسهلا" } },
        },
    });

    function refresh() {
        document.querySelectorAll("[data-i18n]").forEach((node) => {
            node.textContent = i18next.t(node.dataset.i18n);
        });
    }
    refresh();

    document
        .querySelector("locale-picker")
        .addEventListener("localechange", async (e) => {
            await i18next.changeLanguage(e.detail.locale);
            refresh();
        });
</script>

<h1 data-i18n="welcome">Welcome</h1>
```

### Polyglot.js

```html
<script type="module">
    import Polyglot from "https://cdn.jsdelivr.net/npm/node-polyglot@2/+esm";
    await customElements.whenDefined("locale-picker");

    const phrases = {
        en: { welcome: "Welcome" },
        fr: { welcome: "Bienvenue" },
    };

    let polyglot = new Polyglot({ phrases: phrases.en });

    document
        .querySelector("locale-picker")
        .addEventListener("localechange", (e) => {
            polyglot = new Polyglot({ phrases: phrases[e.detail.locale] ?? phrases.en });
            document.querySelector("#welcome").textContent = polyglot.t("welcome");
        });
</script>
```

The same pattern applies to every other library: subscribe to
`localechange`, hand the new code to the library, re-render.

---

## gettext via JS

If your translation pipeline already produces `.po` / `.mo` files,
use [Jed](https://messageformat.github.io/Jed/) or
[gettext.js](https://github.com/guillaumepotier/gettext.js) to read
them client-side.

```html
<script type="module">
    import i18n from "https://cdn.jsdelivr.net/npm/gettext.js@2/+esm";
    await customElements.whenDefined("locale-picker");

    const catalogs = {
        en: { messages: { "": {}, "Welcome": ["Welcome"] } },
        fr: { messages: { "": {}, "Welcome": ["Bienvenue"] } },
    };

    const gt = i18n();
    gt.loadJSON(catalogs.en, "messages");

    document
        .querySelector("locale-picker")
        .addEventListener("localechange", (e) => {
            gt.setLocale(e.detail.locale);
            gt.loadJSON(catalogs[e.detail.locale] ?? catalogs.en, "messages");
            document
                .querySelectorAll("[data-gettext]")
                .forEach((n) => (n.textContent = gt.gettext(n.dataset.gettext)));
        });
</script>

<h1 data-gettext="Welcome">Welcome</h1>
```

For full server-side compatibility, generate your JS catalogs from
the same `.po` source the rest of your app uses.

---

## Vanilla state management

If you don't want a library at all, keep the state on a custom
module or a `window` property and re-render manually. The picker's
`localechange` event is the single source of truth:

```html
<script type="module">
    await customElements.whenDefined("locale-picker");

    const strings = {
        en: { welcome: "Welcome", goodbye: "Goodbye" },
        fr: { welcome: "Bienvenue", goodbye: "Au revoir" },
        ar: { welcome: "أهلا وسهلا", goodbye: "وداعا" },
    };

    function render(locale) {
        const t = strings[locale] ?? strings.en;
        document.querySelectorAll("[data-key]").forEach((node) => {
            node.textContent = t[node.dataset.key] ?? node.dataset.key;
        });
    }

    const picker = document.querySelector("locale-picker");
    render(picker.value);
    picker.addEventListener("localechange", (e) => render(e.detail.locale));
</script>

<h1 data-key="welcome">Welcome</h1>
<p data-key="goodbye">Goodbye</p>
```

Two functions, one event listener, no dependencies. For 95% of small
apps this is enough.

---

## Custom-element interop

The picker's `localechange` event has `bubbles: true` and
`composed: true`, so any ancestor (including `document`) can listen
for it. Use this when the picker lives deep in a component tree:

```js
document.addEventListener("localechange", (e) => {
    console.log("Locale changed to", e.detail.locale);
});
```

The `composed` flag means the event crosses Shadow DOM boundaries —
so a picker placed inside another custom element's shadow root still
notifies listeners on the light-DOM document.

---

## Reading and writing from outside

The custom element exposes every attribute as a JS property:

```js
const picker = document.querySelector("locale-picker");
picker.value;            // "en"
picker.value = "fr";     // triggers apply + dispatches localechange
picker.locales;          // ["en", "fr", "ar"]
picker.locales = ["en", "de"]; // re-renders
picker.localeLabels = { en: "English", de: "Deutsch" };
```

Reading from inside the listener is also fine — `e.target` is the
picker element:

```js
picker.addEventListener("localechange", (e) => {
    const picker = e.target;
    console.log("New label:", picker.querySelector("input:checked").nextElementSibling.textContent);
});
```

---

## Cookie-based persistence (server)

`localStorage` persistence flickers on first paint because the
server renders the default locale before the client reads storage.
Prefer a cookie when you have a server in the loop:

```html
<!doctype html>
<html lang="fr" dir="ltr">
    <head>
        <meta charset="utf-8">
        <script type="module" src="/dist/locale-picker.js"></script>
    </head>
    <body>
        <locale-picker
            label="Language"
            locales="en,fr,ar"
            value="fr"
        ></locale-picker>

        <script type="module">
            await customElements.whenDefined("locale-picker");
            document.querySelector("locale-picker")
                .addEventListener("localechange", (e) => {
                    document.cookie =
                        `locale=${e.detail.locale}; path=/; max-age=31536000; SameSite=Lax`;
                });
        </script>
    </body>
</html>
```

The page arrives with the correct `lang` and `dir` already on
`<html>`, no flash. See [./ssr.md](./ssr.md) for the full recipe.

---

## Picking the right strategy

| Need                                       | Strategy                  |
| ------------------------------------------ | ------------------------- |
| Tiny SPA, English + French only            | Native `Intl.*`           |
| ICU MessageFormat, plurals, gender         | FormatJS / i18next        |
| Tree-shaken, type-safe messages            | LinguiJS                  |
| Translator CMS, live editing, screenshots  | Tolgee                    |
| Server-rendered, no FOUC                   | Cookie + SSR pre-seed     |
| Existing gettext `.po` pipeline            | Jed / gettext.js          |

The picker is the same in every case. Only the `localechange`
handler body changes.
