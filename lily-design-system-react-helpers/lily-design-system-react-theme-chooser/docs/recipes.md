# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want more
error handling.

## Follow the OS colour scheme on first visit

```tsx
"use client";

import { useState } from "react";
import { ThemeChooser } from "./lily-design-system-react-theme-chooser";

export function ThemeChooser() {
    const [defaultTheme] = useState(() => {
        if (typeof window === "undefined") return "light";
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    return (
        <ThemeChooser
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
import { ThemeChooser } from "./lily-design-system-react-theme-chooser";

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
        <ThemeChooser
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

## Migrate from a localStorage-only select to a cookie-backed one

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

## Position the dropdown listbox

The control already *is* a flyout — a button that opens a listbox — but
the package ships no CSS, so the list renders in normal flow until you
position it:

```css
.theme-chooser {
    position: relative;
    display: inline-block;
}

.theme-chooser-list {
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 0;
    z-index: 1;
    margin: 0;
    padding: 0;
    list-style: none;
}
```

Full walkthrough, including the `[data-active]` highlight and the
`hidden` interaction, in [styling.md](./styling.md).

## Show the active theme on the trigger

The default trigger is an icon button that never states the theme in
effect. Pass `children` to render the label alongside the glyph, and
extend `label` so the accessible name matches the visible text:

```tsx
<ThemeChooser
    label={`Theme: ${labelFor(theme)}`}
    themesUrl="/t/"
    themes={["light", "dark"]}
    value={theme}
    onChange={setTheme}
>
    {({ value, open, labelFor }) => (
        <>
            <span aria-hidden="true">{labelFor(value)}</span>
            <span aria-hidden="true">{open ? "▴" : "▾"}</span>
        </>
    )}
</ThemeChooser>
```

Otherwise keep the status-region pattern from
[accessibility.md](./accessibility.md).

## Serve themes from a CDN

```tsx
<ThemeChooser
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
<ThemeChooser
    themesUrl="/assets/themes/"
    themes={["light", "dark"]}
    extension=".css?v=2026-06-05"
    label="Theme"
/>
```

The extension is concatenated verbatim, so anything that comes after
the slug works.

## Multiple regions with independent themes

See [`../examples/multiple-choosers.tsx`](../examples/multiple-choosers.tsx).
Each select gets a distinct `name` (so the managed `<link>`s don't
collide) and a distinct `target` (so `data-theme` goes on the section
root rather than `<html>`).

## Sync theme across tabs

```tsx
"use client";

import { useEffect, useState } from "react";
import { ThemeChooser } from "./lily-design-system-react-theme-chooser";

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
        <ThemeChooser
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
<ThemeChooser
    onChange={(slug) => {
        setTheme(slug);
        setThemeCookie(slug);
    }}
    {...required}
/>
```

---

Lily™ and Lily Design System™ are trademarks.
