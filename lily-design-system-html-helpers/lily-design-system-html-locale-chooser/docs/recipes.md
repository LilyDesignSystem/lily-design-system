# Recipes

Task-shaped snippets. Each is self-contained; each assumes the element
is registered (`import "lily-design-system-html-locale-chooser"`) and
that you have applied at least the positioning CSS from
[styling.md](./styling.md).

Throughout, `el` is `document.querySelector("locale-chooser") as LocaleChooser`.

## Follow the browser's language on first visit

Opt in with the boolean attribute. It only applies when there is no
`value` and nothing in storage, so it never overrides a real choice:

```html
<locale-chooser
  label="Choose language"
  locales="en,fr,de,ar"
  storage-key="myapp:locale"
  detect-from-navigator
></locale-chooser>
```

Resolution order is `value` > storage > navigator > `default-value` >
`"en"` > `locales[0]`.

## Negotiate the locale on the server instead

Better than client detection when you can do it: it avoids a flash of
the wrong language and keeps cached HTML unambiguous. Reuse the same
matching rule the element uses so client and server never disagree:

```ts
import { matchNavigatorLanguage } from "lily-design-system-html-locale-chooser";

const SUPPORTED = ["en", "fr", "de", "ar"];

/** "fr-CA,fr;q=0.9,en;q=0.8" → ["fr-CA","fr","en"] */
function parseAcceptLanguage(header: string): string[] {
  return header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.trim(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .map((x) => x.tag);
}

const locale =
  matchNavigatorLanguage(parseAcceptLanguage(req.headers["accept-language"] ?? ""), SUPPORTED) ||
  "en";
```

Then render `value="${locale}"` on the element and leave
`detect-from-navigator` off entirely.

## Read a locale cookie before render

The precedence rule that makes this work: an explicit `value` beats
stored state. Render the cookie value into the attribute and the
element adopts it without a flash.

```njk
{# Eleventy / Nunjucks #}
<html lang="{{ locale | bcp47 }}" dir="{{ locale | dir }}">
  ...
  <locale-chooser
    label="{{ 'nav.language' | t }}"
    locales="en,fr,ar"
    value="{{ locale }}"
    name="locale"
  ></locale-chooser>
```

Set `lang` and `dir` on the server-rendered `<html>` too. The element
re-asserts the same values on upgrade, so matching them server-side
costs nothing and avoids a visible reflow when an RTL locale is
active. Full treatment in [ssr.md](./ssr.md).

## Persist to a cookie instead of localStorage

`storage-key` only speaks localStorage. For a cookie — readable by the
server on the next request — skip `storage-key` and write it yourself:

```ts
el.addEventListener("localechange", (e) => {
  const { locale } = (e as CustomEvent<{ locale: string }>).detail;
  document.cookie =
    `locale=${encodeURIComponent(locale)}; path=/; max-age=31536000; samesite=lax`;
});
```

Do not set both `storage-key` and a cookie unless you have decided
which wins on the next load — two stores drift apart the first time a
user changes locale in another tab.

## Reload the page on locale change

The element applies `lang` and `dir`, but it does not translate
anything. If your content is server-rendered per locale, a navigation
is the honest response:

```ts
el.addEventListener("localechange", (e) => {
  const { locale } = (e as CustomEvent<{ locale: string }>).detail;
  const url = new URL(location.href);
  url.pathname = `/${locale}${url.pathname.replace(/^\/[a-z-]+/i, "")}`;
  location.assign(url);
});
```

Guard against re-entry: the element fires `localechange` once on
initial apply too, so an unconditional `location.assign` here would
loop. Compare against the current locale first:

```ts
let current = el.value;
el.addEventListener("localechange", (e) => {
  const { locale } = (e as CustomEvent<{ locale: string }>).detail;
  if (locale === current) return;   // initial apply, or a no-op re-set
  current = locale;
  location.assign(/* … */);
});
```

## Drive a client-side i18n library

For client-rendered strings, hand the code to your i18n runtime and
re-render. The element owns `lang` / `dir` / persistence; the library
owns messages. See [i18n-integration.md](./i18n-integration.md) for
per-library detail.

```ts
el.addEventListener("localechange", async (e) => {
  const { locale } = (e as CustomEvent<{ locale: string }>).detail;
  await i18n.loadLocale(locale);
  i18n.setLocale(locale);
  renderApp();
});
```

## Show the active language next to the button

The closed button is a glyph only. Mirror the state into visible text:

```ts
const out = document.querySelector("#locale-name")!;
const paint = () => {
  out.textContent = el.labelFor(el.value);
  out.setAttribute("lang", el.tagFor(el.value));
};
el.addEventListener("localechange", paint);
paint();
```

`lang` on the output matters — it is a language name, usually an
endonym, and needs its own language to be pronounced correctly.

## Render endonyms instead of English names

The built-in table is English-only. A language switcher is generally
better with each language named in itself, because a user who cannot
read the current UI language still has to find their own:

```ts
el.localeLabels = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  ar: "العربية",
  ja: "日本語",
  hi: "हिन्दी",
};
```

A common compromise is both — endonym first, English in parentheses —
which stays scannable for support staff:

```ts
el.localeLabels = { fr: "Français (French)", ar: "العربية (Arabic)" };
```

## Put the language code on the button

Two-letter codes are a common alternative to the globe glyph. Subclass
and override the tier-1 hook; the base class keeps all aria wiring:

```ts
import { LocaleChooser } from "lily-design-system-html-locale-chooser";

class CodeLocaleChooser extends LocaleChooser {
  renderButtonContent(): Node {
    const span = document.createElement("span");
    span.className = "locale-chooser-code";
    span.setAttribute("aria-hidden", "true");
    span.textContent = this.value.split(/[-_]/)[0].toUpperCase();  // "fr_CA" → "FR"
    return span;
  }
}
customElements.define("code-locale-chooser", CodeLocaleChooser);
```

Keep `aria-hidden="true"`: the accessible name still comes from
`label` alone, and a bare "FR" is not a usable name. The hook re-runs
whenever `value` or `open` changes, so the code stays current. More in
[custom-rendering.md](./custom-rendering.md).

## Preview a locale inside one region

Point `target` at a subtree and the element writes `lang` / `dir`
there instead of on `<html>`:

```ts
el.target = document.querySelector("#preview")!;
```

Useful for a CMS preview pane where the editor is working in one
language and previewing another. Because `dir` is scoped too, the
preview flips independently — which is exactly what you want, and
also why the surrounding chrome must use logical properties.

Note this sets a *part* language (WCAG 3.1.2), not the document
language (WCAG 3.1.1). A scoped select should not be the page's only
locale control.

## Let the router own `dir`

If a framework or template already writes `dir`, turn the element's
half off rather than letting two writers fight:

```html
<locale-chooser label="Language" locales="en,ar" apply-dir="false"></locale-chooser>
```

The element still writes `lang`, still persists, still fires
`localechange`. Recompute `dir` yourself with the exported helper so
the rule stays identical:

```ts
import { isRtlLocale } from "lily-design-system-html-locale-chooser";
router.afterEach(() => {
  document.documentElement.dir = isRtlLocale(currentLocale) ? "rtl" : "ltr";
});
```

## Open or close the list from your own code

```ts
el.openList();                 // selected option active (or index 0)
el.openList(0);                // force the first option active
el.closeList();                // close, return focus to the button
el.closeList(false);           // close without stealing focus
el.open;                       // → boolean, read-only
```

Opening moves focus to the `<ul>`, so only call `openList()` in
response to a real user gesture. Auto-opening on page load traps
keyboard users who did not ask for it.

## Sync the locale across tabs

`localStorage` fires `storage` in *other* tabs only, so this cannot
loop:

```ts
addEventListener("storage", (e) => {
  if (e.key === "myapp:locale" && e.newValue && e.newValue !== el.value) {
    el.value = e.newValue;   // runs the full apply lifecycle
  }
});
```

## Set the locale from elsewhere on the page

Writing `value` is the supported path — it applies `lang` / `dir`,
persists, and fires `localechange`, exactly as a click would:

```ts
document.querySelector("#reset-to-english")!.addEventListener("click", () => {
  el.value = "en";
});
```

Do not reach into the rendered `<li>` elements and dispatch synthetic
clicks. The rendered DOM is rebuilt whenever a structural attribute
changes, so those references go stale.

## Change the offered locales at runtime

Set the property with an array; the CSV attribute and the rendered
list follow:

```ts
el.locales = ["en", "fr", "es"];
```

A structural change rebuilds the DOM and closes the list. If the
current `value` is no longer in the list, set a valid one in the same
turn — the element does not silently re-resolve:

```ts
el.locales = next;
if (!next.includes(el.value)) el.value = next[0];
```

## Listen for locale changes from outside

`localechange` is `bubbles: true` and `composed: true`, so a delegated
listener anywhere above it works:

```ts
document.addEventListener("localechange", (e) => {
  const { locale } = (e as CustomEvent<{ locale: string }>).detail;
  analytics.track("locale_changed", { locale });
});
```

The detail carries the code in **your** form (`en_US` if that is what
you supplied), not the BCP 47 tag. Use `el.tagFor(locale)` or the
exported `bcp47LocaleTag(locale)` when you need the hyphen form.

## Wait for upgrade before touching properties

Property setters only exist once the class is defined. Setting
`el.locales` before then just puts an expando on a plain element:

```ts
await customElements.whenDefined("locale-chooser");
(document.querySelector("locale-chooser") as LocaleChooser).locales = LOCALES;
```
