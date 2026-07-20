# Recipes

Task-shaped snippets. Each one is self-contained and assumes
`"use client"` at the top of the file.

## Persist the choice and honour the browser on first visit

The usual production configuration. Storage wins for returning users;
the navigator only decides the very first visit.

```tsx
<LocaleSelect
    label="Language"
    locales={["en", "fr", "de", "es"]}
    storageKey="my-app:locale"
    detectFromNavigator
/>
```

Resolution order is `value` > storage > navigator > `defaultValue` >
`"en"` > `locales[0]`.

## Show endonyms instead of English names

A language picker that says "German" is unusable to someone who only
reads German. Override the labels with each language's own name:

```tsx
const endonyms = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
    ja: "日本語",
    ar: "العربية",
};

<LocaleSelect
    label="Language"
    locales={Object.keys(endonyms)}
    localeLabels={endonyms}
/>
```

The options already carry `lang`, so each name is pronounced in the
right voice without extra work.

## Drive a translation library

```tsx
const [locale, setLocale] = useState("en");

<LocaleSelect
    label={t("language")}
    locales={["en", "fr", "de"]}
    value={locale}
    onChange={(code) => {
        setLocale(code);
        i18n.changeLanguage(bcp47LocaleTag(code));
    }}
    storageKey="my-app:locale"
/>
```

`onChange` fires on the initial resolution as well as on user
interaction, so the bundle swap stays in step on first paint. Full
wiring for react-intl and react-i18next is in
[i18n-integration.md](./i18n-integration.md).

## Avoid a flash of the wrong language (SSR)

Render the server-resolved locale as `value` so the first paint is
already correct, rather than letting the client resolve it after
hydration:

```tsx
// app/layout.tsx (server component)
const locale = (await cookies()).get("locale")?.value ?? "en";
return (
    <html lang={locale} dir={isRtlLocale(locale) ? "rtl" : "ltr"}>
        <body><LocaleClient initial={locale} /></body>
    </html>
);
```

```tsx
// LocaleClient.tsx
"use client";
export function LocaleClient({ initial }: { initial: string }) {
    const [locale, setLocale] = useState(initial);
    return (
        <LocaleSelect
            label="Language"
            locales={["en", "fr", "ar"]}
            value={locale}
            onChange={(code) => {
                setLocale(code);
                document.cookie = `locale=${code};path=/;max-age=31536000;samesite=lax`;
            }}
        />
    );
}
```

Set `lang` **and** `dir` on the server. Getting `dir` wrong for one
frame is far more visible than getting `lang` wrong — the whole layout
jumps. See [ssr.md](./ssr.md) and
[`../examples/ssr-cookie.tsx`](../examples/ssr-cookie.tsx).

## Translate one panel, not the page

```tsx
const panelRef = useRef<HTMLDivElement>(null);
const [ready, setReady] = useState(false);

// target needs a committed ref, so render once, then pass it.
useEffect(() => setReady(true), []);

<div ref={panelRef}>
    {ready && (
        <LocaleSelect
            label="Panel language"
            locales={["en", "fr"]}
            name="panel-locale"
            target={panelRef.current}
        />
    )}
</div>
```

This satisfies WCAG 3.1.2 (Language of Parts). It does not satisfy
3.1.1 (Language of Page) — keep a page-level language too. See
[`../examples/scoped-target.tsx`](../examples/scoped-target.tsx).

## Two controls on one page

Give each a distinct `name` so their hidden inputs do not collide in a
surrounding form, and a distinct `storageKey` if both persist:

```tsx
<LocaleSelect label="Interface language" locales={ui} name="ui-locale"
              storageKey="app:ui-locale" />
<LocaleSelect label="Content language" locales={content} name="content-locale"
              storageKey="app:content-locale" applyDir={false} />
```

`applyDir={false}` on the second one: two controls both writing `dir`
to `<html>` will fight, and the last one to change wins. Let exactly
one own direction.

## Submit the locale with a form

The hidden input is always rendered, so no extra wiring is needed:

```tsx
<form action="/preferences" method="post">
    <LocaleSelect label="Language" locales={["en", "fr"]} name="locale" />
    <button type="submit">Save</button>
</form>
```

The posted value is the code in your form (`en_US`, not `en-US`).

## Keep the page in sync when the OS language changes

There is no navigator equivalent of `prefers-color-scheme`'s change
event — `navigator.languages` does fire a `languagechange` event on
`window`, but only when the user changes their browser setting, and
overriding an explicit choice would be hostile. Re-resolve only when
the user has *not* chosen:

```tsx
useEffect(() => {
    function onLanguageChange() {
        if (localStorage.getItem("my-app:locale")) return; // user chose; leave it
        const match = matchNavigatorLanguage(
            Array.from(navigator.languages),
            locales,
        );
        if (match) setLocale(match);
    }
    window.addEventListener("languagechange", onLanguageChange);
    return () => window.removeEventListener("languagechange", onLanguageChange);
}, [locales]);
```

## Sort a long list by endonym

```tsx
const sorted = [...locales].sort((a, b) =>
    localeName(a).localeCompare(localeName(b), bcp47LocaleTag(a)),
);

<LocaleSelect label="Language" locales={sorted} localeLabels={endonyms} />
```

Sorting by code (`de`, `el`, `en`) is meaningless to a reader scanning
"Deutsch / Ελληνικά / English". With 436 options the built-in typeahead
does the heavy lifting — see
[`../examples/all-locales.tsx`](../examples/all-locales.tsx).

## Style the trigger from open state without a render prop

```css
.locale-select-button::after { content: "▾"; display: inline-block; }
.locale-select-button[aria-expanded="true"]::after { transform: rotate(180deg); }
```

No `children` needed — `aria-expanded` is already on the button.

---

Lily™ and Lily Design System™ are trademarks.
