# AGENTS / ssr — LocaleSelect

SSR specifics for `LocaleSelect`. Read
[`../../AGENTS.md`](../../AGENTS.md) for the catalog-wide React
conventions; this file is the per-helper application.

## The directive

`LocaleSelect.tsx` is a **client component**. Every consumer file that
imports it should also carry `"use client"` if it touches React state
or hooks.

If `LocaleSelect.tsx` does not currently start with `"use client"`,
add it at the top:

```tsx
"use client";

import * as React from "react";
// …
```

The directive is enforced by the bundler under Next.js / Remix / Vite
SSR. Without it, the select compiles to a server boundary and errors at
runtime when `useState` / `useEffect` are called.

## What renders on the server

The select outputs deterministic HTML based purely on the resolved
`value`:

```html
<select class="locale-select" aria-label="Language" name="locale">
    <option class="locale-select-option" value="en" lang="en">English</option>
    <option class="locale-select-option" value="fr" lang="fr">French</option>
</select>
```

If `value` is supplied as a non-empty string, the `<select>` renders
with that option selected. Otherwise the first option is selected (the
native `<select>` default).

The pure helpers (`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
`matchNavigatorLanguage`) are safe to import from a server component for
pre-resolution.

## What happens on hydration

The first `useEffect` runs and:

1. Resolves the initial code per `spec/index.md §5.2`
   (`value` > storage > navigator > `defaultValue` > `"en"` > `locales[0]`).
2. If uncontrolled and the resolved code differs from current state,
   `setInternalValue(resolved)` triggers a re-render.
3. `applyLocale(code)` writes `lang` / `dir` on the target and (if
   set) `localStorage[storageKey]`.

If the resolved code differs from what the server rendered (because
`localStorage` resolved to `ar` but the server defaulted to `en`), the
user sees one frame of LTR content before the effect runs.

The fix is to pre-resolve server-side and pass via `value`. See the
cookie recipe below.

## Next.js App Router cookie recipe

Full working example in
[`../examples/08-ssr-cookie.tsx`](../examples/08-ssr-cookie.tsx). The
shape is:

```tsx
// app/layout.tsx — SERVER component
import { cookies } from "next/headers";
import { LocaleClient } from "./locale-client";
import { isRtlLocale, bcp47LocaleTag } from "./lily-design-system-react-locale-select";

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

```tsx
// app/locale-client.tsx — CLIENT component
"use client";

import * as React from "react";
import { LocaleSelect } from "./lily-design-system-react-locale-select";

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
            <LocaleSelect
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
- Select mounts already showing the right option selected.
- User picks `en`. Select writes `<html lang="en" dir="ltr">` and the
  cookie; next request paints from byte zero in English.

## Remix loader recipe

```tsx
// app/root.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { isRtlLocale, bcp47LocaleTag } from "./lily-design-system-react-locale-select";

export async function loader({ request }: LoaderFunctionArgs) {
    const cookie = request.headers.get("cookie") ?? "";
    const locale = cookie.match(/locale=([^;]+)/)?.[1] ?? "en";
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

`LocaleClient` is the same client component as in the Next.js example.

## Accept-Language fallback

When the cookie is absent, fall back to the request's `Accept-Language`
header:

```tsx
import { matchNavigatorLanguage } from "./lily-design-system-react-locale-select";

const SUPPORTED = ["en", "fr", "ar"];

function pickFromAcceptLanguage(header: string | null): string {
    if (!header) return SUPPORTED[0];
    const tags = header
        .split(",")
        .map((s) => s.split(";")[0].trim());
    return matchNavigatorLanguage(tags, SUPPORTED) || SUPPORTED[0];
}
```

Use this server-side, then pass the result as `initialLocale` to the
client component. The `matchNavigatorLanguage` helper is pure and safe
to import from a server component.

## Vite SSR / plain React

Without a server framework there's no first-paint problem worth
solving — the select hydrates from `localStorage` before content
renders if you mount it at the top of `<body>`. Avoid styles depending
on `dir` for the first paint, or hard-code the default `lang`/`dir` in
`index.html`.

## Common pitfalls

### "Hydration mismatch: Server rendered X but client rendered Y"

**Cause.** The select's effect resolved a code different from what the
server rendered (because the server used `value="en"` but `localStorage`
has `"ar"`).

**Fix.** Mount the select with the value that the server rendered. If
you're using `localStorage`, switch to a cookie so the server can read it.

### "ReferenceError: document is not defined"

**Cause.** Helper code accessed `document` outside `useEffect`.

**Fix.** Wrap with `typeof document !== "undefined"` or move into
`useEffect`. The Lily select already does this; if you fork, keep the
guards.

### "use client must be at the top of the file"

**Cause.** The directive is after an import or comment block.

**Fix.** Place `"use client";` as the first non-blank line.

### "Server-rendered dir does not match client RTL detection"

**Cause.** Server computed `dir` from a different RTL test than
`isRtlLocale`.

**Fix.** Import `isRtlLocale` from this package and use it on the
server too. Both server and client run the same predicate.

## Streaming SSR

React 19's streaming SSR fires effects only after the relevant chunk
hydrates. The select's first-mount effect runs once per component
instance after that chunk's hydration completes. No special handling
needed.

If the consumer streams a fragment that needs its own locale, wrap it
in an element with explicit `lang` and `dir` so the fragment renders in
the right direction before hydration completes.

## Server Components and RSC boundaries

The select itself MUST be a client component. But the cookie-read +
`<html lang dir>` writing happens in a server component (the layout).
The handoff is:

| Server component                     | Client component                |
| ------------------------------------ | ------------------------------- |
| Reads cookie / Accept-Language       | Receives `initialLocale` prop   |
| Computes `lang` and `dir`            | Renders `<LocaleSelect>`        |
| Writes `<html lang dir>`             | Wires `onChange` cookie writer  |
| Imports pure helpers only            | Imports `LocaleSelect` + helpers |

Importing `LocaleSelect` (the React component) from a server component
would force the server bundle to include the client runtime. Import
only the pure helpers there.

## Checklist for SSR adoption

- [ ] `LocaleSelect.tsx` starts with `"use client"`.
- [ ] Server reads the cookie and writes `<html lang dir>`.
- [ ] Server uses `bcp47LocaleTag` and `isRtlLocale` to compute the
      values (same predicates as the client).
- [ ] Client component receives the resolved locale via props and
      passes it as `value` to the select.
- [ ] `onChange` writes the cookie (via `document.cookie` or a server
      action).
- [ ] Storage key (if used) is for cross-tab convenience only, not for
      SSR correctness.

## References

- React 19 — Client Components:
  <https://react.dev/reference/rsc/use-client>
- Next.js App Router — `cookies()`:
  <https://nextjs.org/docs/app/api-reference/functions/cookies>
- Remix — Cookies:
  <https://remix.run/docs/en/main/utils/cookies>
- MDN — `Accept-Language`:
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language>
- RFC 4647 — Matching of Language Tags:
  <https://www.rfc-editor.org/rfc/rfc4647>
