# i18n integration

`LocalePicker` is intentionally not an i18n library. It changes the
document language and tells you when the user changed it; the actual
string substitution is your i18n library's job.

This page shows how to wire the picker to the four most common React
i18n stacks: **react-intl**, **react-i18next**, **Lingui**, and
**FormatJS / raw `Intl.*`**.

The wiring pattern is always the same:

1. Pair `value` + `onChange` with your i18n library's current-locale
   state.
2. Call the library's `setLocale` / `changeLanguage` / equivalent from
   `onChange`.
3. (Optionally) pre-seed `value` server-side for flicker-free SSR.

---

## react-intl (FormatJS)

[`react-intl`](https://formatjs.github.io/docs/react-intl/) provides an
`<IntlProvider>` that distributes a locale and a message dictionary
through context. Drive the provider's `locale` prop from the picker.

```tsx
"use client";

import * as React from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import { LocalePicker } from "lily-design-system-react-locale-picker";

import enMessages from "./messages/en.json";
import frMessages from "./messages/fr.json";
import arMessages from "./messages/ar.json";

const MESSAGES: Record<string, Record<string, string>> = {
    en: enMessages,
    fr: frMessages,
    ar: arMessages,
};

export function App() {
    const [locale, setLocale] = React.useState("en");

    return (
        <IntlProvider locale={locale} messages={MESSAGES[locale]} defaultLocale="en">
            <LocalePicker
                label="Language"
                locales={["en", "fr", "ar"]}
                value={locale}
                onChange={setLocale}
                storageKey="app-locale"
                detectFromNavigator
            />

            <h1>
                <FormattedMessage id="home.heading" defaultMessage="Welcome" />
            </h1>
        </IntlProvider>
    );
}
```

`react-intl` re-renders all descendants when `locale` changes; every
`<FormattedMessage>` re-evaluates against the new dictionary.

If you also need to refetch a locale-dependent API response, wrap the
setter:

```tsx
onChange={(code) => {
    setLocale(code);
    refetchCalendarEvents({ locale: code });
}}
```

---

## react-i18next

[`react-i18next`](https://react.i18next.com/) exposes a
`useTranslation()` hook that returns `t()` for messages and `i18n` for
runtime control. Use `i18n.changeLanguage(code)` from `onChange`.

```tsx
"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { LocalePicker } from "lily-design-system-react-locale-picker";

export function App() {
    const { t, i18n } = useTranslation();

    return (
        <>
            <LocalePicker
                label="Language"
                locales={["en", "fr", "ar"]}
                value={i18n.resolvedLanguage}
                onChange={(code) => i18n.changeLanguage(code)}
                storageKey="i18next-locale"
            />
            <h1>{t("home.heading")}</h1>
            <p>{t("home.body")}</p>
        </>
    );
}
```

The setup that goes once in `i18n.ts` looks like:

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: { /* … */ } },
            fr: { translation: { /* … */ } },
            ar: { translation: { /* … */ } },
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    });
```

`react-i18next` re-renders subscribed components automatically on
language change. No `useEffect` needed.

---

## Lingui

[Lingui](https://lingui.dev/) compiles messages into runtime-free
strings and exposes an `<I18nProvider>` whose `i18n` instance carries
the locale.

```tsx
"use client";

import * as React from "react";
import { i18n } from "@lingui/core";
import { I18nProvider, Trans } from "@lingui/react";
import { LocalePicker } from "lily-design-system-react-locale-picker";

import { messages as enMessages } from "./locales/en/messages";
import { messages as frMessages } from "./locales/fr/messages";

i18n.load("en", enMessages);
i18n.load("fr", frMessages);
i18n.activate("en");

export function App() {
    const [locale, setLocale] = React.useState("en");

    function activate(code: string) {
        setLocale(code);
        i18n.activate(code);
    }

    return (
        <I18nProvider i18n={i18n}>
            <LocalePicker
                label="Language"
                locales={["en", "fr"]}
                value={locale}
                onChange={activate}
                storageKey="lingui-locale"
            />

            <h1>
                <Trans>Welcome</Trans>
            </h1>
        </I18nProvider>
    );
}
```

Lingui's `i18n.activate(code)` is synchronous after the catalogues are
loaded; the picker calls it from `onChange` and `<Trans>` re-renders
without further wiring.

For async catalog loading (dynamic import per locale), wrap `activate`
in an async function and await the catalog before flipping locale:

```tsx
async function activate(code: string) {
    const { messages } = await import(`./locales/${code}/messages`);
    i18n.load(code, messages);
    i18n.activate(code);
    setLocale(code);
}
```

---

## Raw `Intl.*`

For apps with a handful of strings and no formal i18n library, store
the locale in `useState` and pass it to `Intl` formatters directly. The
picker still owns the `lang` / `dir` lifecycle:

```tsx
"use client";

import * as React from "react";
import { LocalePicker } from "lily-design-system-react-locale-picker";

export function App() {
    const [locale, setLocale] = React.useState("en");

    const dateFmt = React.useMemo(
        () => new Intl.DateTimeFormat(locale, { dateStyle: "long" }),
        [locale],
    );
    const currencyFmt = React.useMemo(
        () => new Intl.NumberFormat(locale, { style: "currency", currency: "GBP" }),
        [locale],
    );

    return (
        <>
            <LocalePicker
                label="Language"
                locales={["en", "en-US", "fr", "fr-CA", "ar"]}
                value={locale}
                onChange={setLocale}
                storageKey="app-locale"
            />

            <p>Today: {dateFmt.format(new Date())}</p>
            <p>Balance: {currencyFmt.format(1234.56)}</p>
        </>
    );
}
```

`Intl.*` formatters accept both `en_US` and `en-US`; they normalise
internally.

---

## Next.js App Router with URL-prefix locales

If your app uses URL-prefixed locales (`/en/about`, `/fr/about`), drive
the picker from `useParams()` and `onChange` calls `router.push()`:

```tsx
"use client";

import * as React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { LocalePicker } from "lily-design-system-react-locale-picker";

export function LocaleSwitcher() {
    const params = useParams<{ locale: string }>();
    const pathname = usePathname();
    const router = useRouter();

    function navigateToLocale(next: string) {
        const newPath = pathname.replace(/^\/(en|fr|ar)/, `/${next}`);
        router.push(newPath);
        router.refresh();
    }

    return (
        <LocalePicker
            label="Language"
            locales={["en", "fr", "ar"]}
            value={params.locale}
            onChange={navigateToLocale}
        />
    );
}
```

The `router.refresh()` invalidates server components and triggers a
re-fetch of locale-dependent server data.

---

## Cookie-based persistence (server)

`localStorage` persistence flickers on first paint because the server
renders the default locale before the client reads storage. Prefer a
cookie when you have a Next.js / Remix server. See [./ssr.md](./ssr.md)
for the full recipe. The picker portion is:

```tsx
<LocalePicker
    label="Language"
    locales={["en", "fr", "ar"]}
    value={locale}
    onChange={(code) => {
        setLocale(code);
        document.cookie =
            `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }}
/>
```

The page arrives with the correct `lang` and `dir` already on `<html>`,
no flash.

---

## Picking the right strategy

| Need                                       | Strategy                  |
| ------------------------------------------ | ------------------------- |
| One small SPA, English + French only       | Raw `Intl.*`              |
| ICU MessageFormat, plurals, gender         | react-intl                |
| Largest ecosystem, plugin-heavy            | react-i18next             |
| Compile-time message extraction, tiny bundle | Lingui                   |
| SEO-friendly URLs per locale, Next.js      | URL prefix + App Router   |
| No FOUC, cookie-backed, server-rendered    | Cookie + server component |

The picker is the same in every case. Only the `value` / `onChange`
target and the body of `onChange` change.

## Multiple instances

A page can host several `LocalePicker` instances (e.g. one global, one
scoped to a panel). Give each a different `name` prop so the
radio-group identities don't collide:

```tsx
<LocalePicker label="Page" name="page-locale" {...} />
<LocalePicker label="Panel" name="panel-locale" target={panelRef.current} {...} />
```

See [examples/09-scoped-target.tsx](../examples/09-scoped-target.tsx)
for the scoped-target pattern.
