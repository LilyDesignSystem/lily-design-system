# SSR conventions for Lily React helpers

Every helper in this catalog compiles cleanly under React 19 server
rendering, including Next.js App Router (server + client components),
Remix (loaders + actions), Vite SSR, and React Server Components.
This file is the cross-helper SSR contract; per-helper docs cover
the cookie / header / URL-prefix strategies.

## The contract

- The helper is a **client component**: its `.tsx` file starts with
  `"use client"`.
- No DOM access during render. `document`, `window`, `localStorage`,
  `navigator` are only touched inside `useEffect`.
- The first render produces deterministic HTML based purely on
  props. If the consumer supplies a `value` prop, the corresponding
  radio is rendered with `checked={true}`; otherwise no radio is
  checked.
- After hydration the first effect runs and resolves the actual
  initial value (from storage, navigator, etc.). If the resolved
  value differs from what the server rendered, the consumer sees
  one frame of unchecked radios before the picker hydrates them.
  This is the "flash of default state" — fix by pre-resolving on
  the server and passing as `value`.

## Why the helpers are client components

The pickers need DOM access for the lifecycle (setting
`data-theme`, `lang`, `dir` on `<html>`, managing the `<link>` in
`<head>`, reading `localStorage`). In RSC vocabulary that makes
them client components — the `"use client"` directive is mandatory.

Pure helper functions exported from the same file (`themeHref`,
`bcp47LocaleTag`, `isRtlLocale`, `localeName`, `matchNavigatorLanguage`)
ARE safe to import from a server component because the bundler does
not pull in the React runtime when only those exports are referenced.
But the canonical pattern is to import them from a separate `.ts`
data file (`locales.ts`) so the server boundary is clear.

## Next.js App Router pattern

End-to-end flow for cookie-based locale resolution:

### 1. Server component reads the cookie

```tsx
// app/layout.tsx — SERVER component (no "use client")
import { cookies } from "next/headers";
import { LocaleClient } from "./locale-client";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = (await cookies()).get("locale")?.value ?? "en";
    const dir = /^(ar|he|fa|ur|ps|sd)/.test(locale) ? "rtl" : "ltr";
    return (
        <html lang={locale.replace(/_/g, "-")} dir={dir}>
            <body>
                <LocaleClient initialLocale={locale}>{children}</LocaleClient>
            </body>
        </html>
    );
}
```

The `<html lang dir>` arrives in the HTTP response from byte zero
— no flash.

### 2. Client component renders the picker

```tsx
// app/locale-client.tsx — CLIENT component
"use client";

import * as React from "react";
import { LocalePicker } from "../lily-design-system-react-locale-picker";

export function LocaleClient({
    initialLocale,
    children,
}: {
    initialLocale: string;
    children: React.ReactNode;
}) {
    const [locale, setLocale] = React.useState(initialLocale);

    function writeCookie(code: string) {
        document.cookie = `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }

    return (
        <>
            <LocalePicker
                label="Language"
                locales={["en", "fr", "ar"]}
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

### 3. Server action (optional) updates the cookie

If the consumer prefers a server action over `document.cookie`:

```ts
// app/actions.ts
"use server";

import { cookies } from "next/headers";

export async function setLocaleCookie(locale: string) {
    (await cookies()).set("locale", locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
    });
}
```

And call from `onChange`:

```tsx
<LocalePicker
    onChange={(code) => {
        setLocale(code);
        setLocaleCookie(code); // server action
    }}
/>
```

The server action re-runs the layout on the next navigation; for a
hard "instant cookie", `document.cookie` is faster but only updates
the current request.

## Remix pattern

```tsx
// app/root.tsx — Remix's root component
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
    const cookie = request.headers.get("cookie") ?? "";
    const locale = cookie.match(/locale=([^;]+)/)?.[1] ?? "en";
    return json({ locale });
}

export default function App() {
    const { locale } = useLoaderData<typeof loader>();
    const dir = /^(ar|he|fa|ur|ps|sd)/.test(locale) ? "rtl" : "ltr";
    return (
        <html lang={locale.replace(/_/g, "-")} dir={dir}>
            <body>
                <LocaleClient initialLocale={locale} />
            </body>
        </html>
    );
}
```

`LocaleClient` is the same as in the Next.js example.

## Vite SSR / plain React

Without a server framework, there's no first-paint problem worth
solving — the picker hydrates from `localStorage` or `navigator`
before content renders if you mount it at the top of `<body>`.
Avoid styles depending on `data-theme` for the first paint, or
hard-code the default theme's `<link>` in `index.html`.

## Common pitfalls

### "Hydration mismatch: server rendered X but client rendered Y"

**Cause.** The picker's effect resolved a different value than the
one that came down in the server-rendered HTML.

**Fix.** Pass a server-resolved `value` to the picker so the SSR
markup matches what the effect will set. Cookie is the easiest
transport.

### "Cannot read properties of undefined (reading 'documentElement')"

**Cause.** Helper code accessed `document` outside a `useEffect`.

**Fix.** Move the access inside `useEffect`. Every helper in this
catalog does this; if you copy the helper code, copy the effect
shape too.

### "Window is not defined"

**Cause.** Pure helper accessed `window` at module load time.

**Fix.** Guard with `typeof window !== "undefined"` or move the
access inside the effect.

### "use client" not honoured

**Cause.** The directive must be the first non-comment token in the
file. Imports must come after.

**Fix.** The Lily helpers all do this. If you fork the helper,
keep the directive first.

## React 19-specific notes

- `useFormStatus` / `useFormState` are React 19 form hooks; the
  pickers don't use them because they're not form helpers.
- `use(promise)` for unwrapping async values is not used; the
  pickers' effects are synchronous from the start.
- `useTransition` is not used; selection is instant.

## Streaming SSR

React 19's streaming SSR fires effects only after the relevant
chunk hydrates. The pickers' first-mount effect runs once per
component instance, after that chunk's hydration completes. No
special handling needed.

If you stream a fragment that needs its own `lang`/`dir`, wrap it
in an element with explicit `lang` and `dir` attributes — don't
rely on the picker's `<html>` write because the stream may arrive
before hydration.

## RSC boundary checklist

| Question                                              | Answer                                  |
| ----------------------------------------------------- | --------------------------------------- |
| Does the picker run on the server?                    | No — it's a client component.           |
| Can a server component import the picker?             | Yes — the import boundary is implicit.  |
| Can a server component import pure helpers?           | Yes — `themeHref`, `bcp47LocaleTag`, … |
| Does `useState`/`useEffect` work?                     | Yes, after hydration.                   |
| Does `localStorage` work during render?               | No — only inside `useEffect`.           |
| Does `cookies()` from `next/headers` work in helper?  | No — helper is client.                  |
| Where do I read cookies?                              | In a server component, pipe to client.  |
| Where do I write cookies?                             | `document.cookie` (client) or a server action. |

## References

- React 19 — Client Components:
  <https://react.dev/reference/rsc/use-client>
- Next.js App Router — `cookies()`:
  <https://nextjs.org/docs/app/api-reference/functions/cookies>
- Next.js App Router — Server Actions:
  <https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations>
- Remix — Cookies:
  <https://remix.run/docs/en/main/utils/cookies>
- React docs — Hydration mismatches:
  <https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html>
