# SSR — Server-side rendering, cookies, and Accept-Language

The picker compiles cleanly under SSR but renders nothing locale-
specific on the server unless the consumer pre-resolves the locale.
This page covers the resolution strategies, ordered by quality.

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

Next.js (and Remix, Astro, etc.) render the HTML on the server before
the JS bundle hydrates. If your `<html>` arrives with `lang="en"` and
the client picks `ar`, the page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints English page (FOUC-style flash).
3. JS hydrates, `LocalePicker` runs its `useEffect`, reads
   `localStorage["app-locale"] === "ar"`, writes
   `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. The picker can't avoid it on its own
because `localStorage` and `navigator.languages` aren't accessible
server-side. The consumer fixes it by pre-resolving the locale on the
server and seeding `value`.

---

## Strategy 1: Next.js App Router cookie (recommended)

A cookie survives reloads, is readable on every request, and avoids the
flash. The pattern has two pieces: a server component (the layout) and
a client component (the picker wrapper).

### Server component (layout)

```tsx
// app/layout.tsx — SERVER component
import { cookies } from "next/headers";
import { isRtlLocale, bcp47LocaleTag } from "lily-design-system-react-locale-picker";
import { LocaleClient } from "./locale-client";

const KNOWN = new Set(["en", "fr", "ar", "he"]);

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("locale")?.value;
    const locale = cookieLocale && KNOWN.has(cookieLocale) ? cookieLocale : "en";
    const lang = bcp47LocaleTag(locale);
    const dir = isRtlLocale(locale) ? "rtl" : "ltr";

    return (
        <html lang={lang} dir={dir}>
            <body>
                <LocaleClient initialLocale={locale}>{children}</LocaleClient>
            </body>
        </html>
    );
}
```

`cookies()` is React 19 / Next 15 `async`. The pure helpers
(`bcp47LocaleTag`, `isRtlLocale`) are safe to import from a server
component because they have no React or DOM dependency.

### Client component (picker wrapper)

```tsx
// app/locale-client.tsx — CLIENT component
"use client";

import * as React from "react";
import { LocalePicker } from "lily-design-system-react-locale-picker";

export function LocaleClient({
    initialLocale,
    children,
}: {
    initialLocale: string;
    children: React.ReactNode;
}) {
    const [locale, setLocale] = React.useState(initialLocale);

    function writeCookie(code: string) {
        document.cookie =
            `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }

    return (
        <>
            <LocalePicker
                label="Language"
                locales={["en", "fr", "ar", "he"]}
                value={locale}
                onChange={(code) => {
                    setLocale(code);
                    writeCookie(code);
                }}
            />
            {children}
        </>
    );
}
```

Result:

- First paint: `<html lang="ar" dir="rtl">` arrives in the HTML
  response. No flash, no layout shift.
- Picker mounts already showing the right radio checked.
- User picks `en`. Picker writes `<html lang="en" dir="ltr">` and the
  cookie. Next request paints from byte zero in English.

---

## Strategy 2: URL prefix (Next.js i18n routing)

URLs like `/en/about` and `/fr/about` are crawlable by search engines
and shareable as locale-specific links. Next.js 15 doesn't bundle
locale routing, so set up a `[locale]` dynamic segment yourself:

```
app/
└── [locale]/
    ├── layout.tsx
    └── about/page.tsx
```

```tsx
// app/[locale]/layout.tsx — SERVER component
import { notFound } from "next/navigation";
import { isRtlLocale, bcp47LocaleTag } from "lily-design-system-react-locale-picker";

const KNOWN = new Set(["en", "fr", "ar"]);

export default function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    if (!KNOWN.has(params.locale)) notFound();

    return (
        <html lang={bcp47LocaleTag(params.locale)} dir={isRtlLocale(params.locale) ? "rtl" : "ltr"}>
            <body>
                <LocaleSwitcher current={params.locale} />
                {children}
            </body>
        </html>
    );
}
```

```tsx
// app/[locale]/locale-switcher.tsx — CLIENT component
"use client";

import { usePathname, useRouter } from "next/navigation";
import { LocalePicker } from "lily-design-system-react-locale-picker";

export function LocaleSwitcher({ current }: { current: string }) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <LocalePicker
            label="Language"
            locales={["en", "fr", "ar"]}
            value={current}
            onChange={(code) => {
                router.push(pathname.replace(/^\/(en|fr|ar)/, `/${code}`));
                router.refresh();
            }}
        />
    );
}
```

`router.refresh()` re-fetches server components in the new locale.

---

## Strategy 3: Accept-Language fallback

If you don't have a cookie yet (first visit), use the request's
`Accept-Language` header to pick a default:

```tsx
// app/layout.tsx
import { cookies, headers } from "next/headers";
import {
    matchNavigatorLanguage,
    isRtlLocale,
    bcp47LocaleTag,
} from "lily-design-system-react-locale-picker";

const SUPPORTED = ["en", "fr", "ar"];

function pickFromAcceptLanguage(header: string | null): string {
    if (!header) return SUPPORTED[0];
    const tags = header
        .split(",")
        .map((s) => s.split(";")[0].trim());
    return matchNavigatorLanguage(tags, SUPPORTED) || SUPPORTED[0];
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const requestHeaders = await headers();

    const cookieLocale = cookieStore.get("locale")?.value;
    const locale = cookieLocale && SUPPORTED.includes(cookieLocale)
        ? cookieLocale
        : pickFromAcceptLanguage(requestHeaders.get("accept-language"));

    return (
        <html lang={bcp47LocaleTag(locale)} dir={isRtlLocale(locale) ? "rtl" : "ltr"}>
            <body>
                <LocaleClient initialLocale={locale}>{children}</LocaleClient>
            </body>
        </html>
    );
}
```

The picker is unchanged. If you need RFC 4647-quality negotiation,
replace `matchNavigatorLanguage` with `@formatjs/intl-localematcher`.

---

## Strategy 4: client-only (`localStorage` / navigator)

The fallback when there is no server. The picker flickers (default
paints first, then the resolved locale takes over) but everything else
works.

```tsx
"use client";

import { LocalePicker } from "lily-design-system-react-locale-picker";

export default function Page() {
    return (
        <LocalePicker
            label="Language"
            locales={["en", "fr", "ar"]}
            storageKey="app-locale"
            detectFromNavigator
        />
    );
}
```

Acceptable for:

- SPAs with no SSR.
- Storybook / docs sites where the flash is invisible.
- Embedded widgets inside another app where the host owns `<html>`.

---

## Remix loader

Remix's loader on `root.tsx` plays the role of Next.js's layout.tsx:

```tsx
// app/root.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { isRtlLocale, bcp47LocaleTag } from "lily-design-system-react-locale-picker";
import { LocaleClient } from "./locale-client";

const SUPPORTED = ["en", "fr", "ar"];

export async function loader({ request }: LoaderFunctionArgs) {
    const cookie = request.headers.get("cookie") ?? "";
    const cookieLocale = cookie.match(/locale=([^;]+)/)?.[1];
    const locale = cookieLocale && SUPPORTED.includes(cookieLocale)
        ? cookieLocale
        : "en";
    return json({ locale });
}

export default function App() {
    const { locale } = useLoaderData<typeof loader>();
    return (
        <html lang={bcp47LocaleTag(locale)} dir={isRtlLocale(locale) ? "rtl" : "ltr"}>
            <body>
                <LocaleClient initialLocale={locale} />
            </body>
        </html>
    );
}
```

`LocaleClient` is the same client component as in Strategy 1.

---

## Streaming SSR considerations

React 19's streaming SSR sends `<html>` first, then streams the body.
Strategy 1 (`<html lang dir>` written in the server layout) works
correctly because `<html>` is sent before any streamed content.

If you stream individual components with their own bidi behaviour
(e.g. a chat panel showing user-supplied RTL text), wrap each with
explicit `lang` and `dir` so the streamed fragment doesn't get the
wrong inherited direction during the race.

---

## Hydration mismatch

If the server renders `<html lang="en">` and the client picks `ar`
during hydration, React 19 logs a hydration mismatch warning. The fix
is to mount the picker with `value=` matching what the server sent.

The full pattern is in Strategy 1 above: the server's `cookies()`
result is passed via `initialLocale` to the client component, which
uses it as the `useState` initial value, which becomes `value` on the
picker. Server and client agree.

---

## Tests for SSR

The picker's vitest suite runs in jsdom (client-side). For full SSR
tests:

- **Compile check** — TypeScript will catch invalid SSR usage (e.g.
  touching `document` outside `useEffect`).
- **End-to-end** — Playwright with `page.goto(…)` and check the raw
  HTML response (`page.content()` before JS) contains
  `<html lang="fr" dir="ltr">`.
- **Snapshot** — render the layout server component manually using
  `react-dom/server.renderToString` with a mocked `cookies()`, snapshot
  the result.

The picker itself has no SSR-specific code path to test beyond "the
component compiles in SSR mode and renders the checked radio for the
seeded `value`". The reference test suite covers that under jsdom by
asserting that `value` controls which radio is checked on mount.

---

## React Server Components: what NOT to do

Don't import `LocalePicker` (the React component) from a server
component. It carries `"use client"` and will pull the React client
runtime into the server bundle. Import only the pure helpers
(`bcp47LocaleTag`, `isRtlLocale`, `localeName`, `matchNavigatorLanguage`,
`defaultLocaleLabels`) from server components.

```tsx
// ❌ Don't do this in a server component
import { LocalePicker } from "lily-design-system-react-locale-picker";

// ✅ Do this in a server component
import {
    bcp47LocaleTag,
    isRtlLocale,
} from "lily-design-system-react-locale-picker";
```

---

## References

- React 19 — Client Components:
  <https://react.dev/reference/rsc/use-client>
- React 19 — Server Components:
  <https://react.dev/reference/rsc/server-components>
- Next.js App Router — `cookies()`:
  <https://nextjs.org/docs/app/api-reference/functions/cookies>
- Next.js App Router — `headers()`:
  <https://nextjs.org/docs/app/api-reference/functions/headers>
- Remix — Cookies:
  <https://remix.run/docs/en/main/utils/cookies>
- MDN — `Accept-Language` header:
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language>
- RFC 4647 — Matching of Language Tags:
  <https://www.rfc-editor.org/rfc/rfc4647>
- `@formatjs/intl-localematcher` — RFC 4647 best-fit matcher:
  <https://formatjs.github.io/docs/polyfills/intl-localematcher/>
