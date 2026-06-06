# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want more
error handling.

## Follow the OS colour scheme on first visit

```tsx
"use client";

import { useState } from "react";
import { ThemePicker } from "./lily-design-system-react-theme-picker";

export function ThemeChooser() {
    const [defaultTheme] = useState(() => {
        if (typeof window === "undefined") return "light";
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    return (
        <ThemePicker
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark"]}
            defaultValue={defaultTheme}
            storageKey="my-app:theme"
        />
    );
}
```

The user's explicit choice (via `storageKey`) wins on later visits.

## Track OS colour scheme changes live

```tsx
"use client";

import { useEffect, useState } from "react";
import { ThemePicker } from "./lily-design-system-react-theme-picker";

export function ThemeChooser() {
    const [theme, setTheme] = useState("");

    useEffect(() => {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? "dark" : "light");
        };
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    return (
        <ThemePicker
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark"]}
            value={theme}
            onChange={setTheme}
        />
    );
}
```

## Read a theme cookie before render (Next.js App Router)

See [`../examples/next-cookie/`](../examples/next-cookie/) for the
full recipe.

## Migrate from a localStorage-only picker to a cookie-backed one

1. Keep `storageKey` for now so existing users don't lose their
   preference.
2. In `onChange`, also write the cookie:
   ```tsx
   onChange={(slug) => {
       setTheme(slug);
       document.cookie = `theme=${slug}; path=/; max-age=31536000; SameSite=Lax`;
   }}
   ```
3. On the server, prefer the cookie. On the client, prefer the
   server-supplied value via `value` (which short-circuits the
   storage read).

## Build a flyout / dropdown UI

Use [custom-rendering](./custom-rendering.md) to swap the radio list
for a button-triggered popover. Keep the picker's fieldset around the
flyout *trigger* so screen readers still hear the group label.

```tsx
<ThemePicker label="Theme" themesUrl="/t/" themes={["light", "dark"]}>
    {({ themes, value, setTheme, labelFor }) => (
        <Popover>
            <PopoverTrigger>{labelFor(value)}</PopoverTrigger>
            <PopoverContent>
                {themes.map((t) => (
                    <button key={t} onClick={() => setTheme(t)}>
                        {labelFor(t)}
                    </button>
                ))}
            </PopoverContent>
        </Popover>
    )}
</ThemePicker>
```

## Serve themes from a CDN

```tsx
<ThemePicker
    themesUrl="https://cdn.example.com/lily-themes/"
    themes={["light", "dark", "abyss"]}
    label="Theme"
/>
```

The CDN must allow cross-origin stylesheet loading (a stylesheet
served from a different origin does not need CORS, but a `<link
crossorigin="…">` attribute is needed if you also need
`document.styleSheets[].cssRules` access from the same origin).

## Cache-bust a theme

```tsx
<ThemePicker
    themesUrl="/assets/themes/"
    themes={["light", "dark"]}
    extension=".css?v=2026-06-05"
    label="Theme"
/>
```

The extension is concatenated verbatim, so anything that comes after
the slug works.

## Multiple regions with independent themes

See [`../examples/multiple-pickers.tsx`](../examples/multiple-pickers.tsx).
Each picker gets a distinct `name` (so the radios and managed
`<link>`s don't collide) and a distinct `target` (so `data-theme`
goes on the section root rather than `<html>`).

## Sync theme across tabs

```tsx
"use client";

import { useEffect, useState } from "react";
import { ThemePicker } from "./lily-design-system-react-theme-picker";

export function ThemeChooser() {
    const [theme, setTheme] = useState("");

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === "my-app:theme" && e.newValue) {
                setTheme(e.newValue);
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    return (
        <ThemePicker
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark"]}
            value={theme}
            onChange={setTheme}
            storageKey="my-app:theme"
        />
    );
}
```

`localStorage`'s `storage` event fires on other tabs (not the
writing tab), so this propagates choices cross-tab.

## Server action for cookie write

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
        setThemeCookie(slug);
    }}
    {...required}
/>
```
