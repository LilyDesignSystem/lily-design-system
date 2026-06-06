# SSR and hydration

The picker is SSR-safe out of the box but does not, on its own,
deliver a flicker-free first paint. This guide explains why and how
to close the gap.

## What the picker does on the server

Under SSR (Next.js App Router server components, Remix loaders,
Vite SSR), no `useEffect` runs and the picker does not touch the
DOM. The rendered HTML looks like:

```html
<fieldset class="theme-picker" role="radiogroup" aria-label="Theme">
    <label class="theme-picker-option">
        <input type="radio" name="theme" value="light" />
        <span class="theme-picker-option-label">Light</span>
    </label>
    …
</fieldset>
```

No radio is checked unless the consumer supplied a non-empty `value`.

## What happens on hydration

On the client the picker's first `useEffect` runs once after mount:

1. Resolves the initial slug per [spec.md §5.2](../spec.md#52-initial-value-resolution).
2. (Uncontrolled) Writes the resolved slug to internal state.
3. Injects / sets the managed `<link>` href.
4. Sets `data-theme` on the target.

If the resolved slug differs from the one that the server rendered
with, the user sees one frame of unstyled (or wrongly-themed) content
before the effect runs. This is the "flash of unstyled theme" (FOUT).

## How to get a flicker-free first paint

The fix is to **resolve the theme on the server** and inline both:

- `<html data-theme="<slug>">` in the document shell, and
- the `<link rel="stylesheet" href="/assets/themes/<slug>.css">`

so that CSS is in place before any pixel is painted. The picker can
then hydrate without changing anything visible.

### Next.js App Router recipe

End-to-end code lives in
[`../examples/next-cookie/`](../examples/next-cookie/).
The shape is:

1. `app/layout.tsx` (server component) reads the `theme` cookie via
   `cookies()` and writes `<html data-theme="…">` plus the active
   theme's `<link rel="stylesheet">`.
2. A client component (`app/theme-client.tsx`) wraps the picker and
   the rest of the app, seeding `value` from the server-resolved
   cookie value.
3. When the user picks a new theme, the picker's `onChange` writes
   the cookie via `document.cookie` so the next SSR pass sees it.

```tsx
// app/layout.tsx — SERVER
import { cookies } from "next/headers";
import { ThemeClient } from "./theme-client";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const theme = (await cookies()).get("theme")?.value ?? "light";
    return (
        <html lang="en" data-theme={theme}>
            <head>
                <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
            </head>
            <body>
                <ThemeClient initialTheme={theme}>{children}</ThemeClient>
            </body>
        </html>
    );
}
```

```tsx
// app/theme-client.tsx — CLIENT
"use client";

import { useState } from "react";
import { ThemePicker } from "./lily-design-system-react-theme-picker";

export function ThemeClient({
    initialTheme,
    children,
}: {
    initialTheme: string;
    children: React.ReactNode;
}) {
    const [theme, setTheme] = useState(initialTheme);
    return (
        <>
            <ThemePicker
                label="Theme"
                themesUrl="/assets/themes/"
                themes={["light", "dark", "abyss"]}
                value={theme}
                onChange={(slug) => {
                    setTheme(slug);
                    document.cookie =
                        `theme=${slug}; path=/; max-age=31536000; SameSite=Lax`;
                }}
            />
            {children}
        </>
    );
}
```

### Remix recipe

```tsx
// app/root.tsx
import { json, useLoaderData } from "@remix-run/react";

export async function loader({ request }: { request: Request }) {
    const cookie = request.headers.get("cookie") ?? "";
    const theme = cookie.match(/theme=([^;]+)/)?.[1] ?? "light";
    return json({ theme });
}

export default function App() {
    const { theme } = useLoaderData<typeof loader>();
    return (
        <html lang="en" data-theme={theme}>
            <head>
                <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
            </head>
            <body>
                <ThemeClient initialTheme={theme} />
            </body>
        </html>
    );
}
```

### Plain Vite + React recipe

Without SSR, there is no first-paint problem worth solving — the
picker hydrates from `localStorage` before content renders if you
mount it at the top of `<body>`. Avoid styles depending on
`data-theme` for the first paint, or hard-code the default theme's
`<link>` in `index.html`.

## Server actions for cookie writes

Next.js consumers may prefer a server action over `document.cookie`:

```ts
// app/actions.ts
"use server";

import { cookies } from "next/headers";

export async function setThemeCookie(slug: string) {
    (await cookies()).set("theme", slug, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
    });
}
```

```tsx
<ThemePicker
    onChange={(slug) => {
        setTheme(slug);
        setThemeCookie(slug); // server action
    }}
    {...required}
/>
```

The server action re-runs the layout on the next navigation. For an
instant cookie that affects the current request, `document.cookie`
is faster.

## Why we don't auto-resolve from the cookie

The picker has no opinion about transport (cookie? header?
IndexedDB? URL parameter?). Cookies are the right answer for
Next.js + Remix, but not for Cloudflare-Workers-based hosts,
embedded contexts, or apps that already have a server-side
preference store. The picker stays transport-agnostic and lets
the consumer wire the integration.

## React 19 specifics

- The picker is a client component. The Next.js / Remix server
  component that reads the cookie passes the resolved theme to a
  client component (the picker, or a wrapper) via props.
- React 19 effects run after hydration. StrictMode double-invokes
  them in development; the picker's `initialisedRef` guard handles
  it.
- Server Components cannot directly render `ThemePicker` — they
  render a client wrapper that renders the picker. This is the
  canonical RSC boundary pattern.
