# Theme principles (React adaptation)

This file adapts the cross-framework Lily theme principles
(`../../../AGENTS/theme.md`) to React 19. All helpers in this
catalog follow these rules; `ThemePicker` is the canonical
implementation.

## The core split

Themes live entirely in **consumer CSS** and an optional
`ThemeProvider` (not currently part of the React helpers; see the
headless library). The helpers do not bake colour, spacing,
typography, or breakpoints into their markup.

## Reference palette (default examples)

The example apps default to an NHS-aligned palette so the demos
look familiar to public-sector users; teams swap any value via CSS
custom properties without touching component code.

- primary `#2563eb`
- NHS blue `#005eb8`
- danger `#dc2626`
- warning `#f59e0b`
- success `#16a34a`
- page background `#f9fafb`
- card background `#ffffff`

## Token shape

The theme is exposed as a flat object whose keys flatten into
`--theme-{path}` CSS custom properties via a `ThemeProvider`
component (when present in the consumer's app):

```ts
{
  color: { primary: "#2563eb", danger: "#dc2626", success: "#16a34a" },
  space: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "2rem" },
  font:  { body: "system-ui, sans-serif", heading: "system-ui, sans-serif" },
  radius: { sm: "0.25rem", md: "0.5rem", lg: "1rem" },
}
```

Consumer CSS reads `var(--theme-color-primary)`,
`var(--theme-space-md)`, etc.

## How `ThemePicker` connects

`ThemePicker` writes `data-theme="<slug>"` on a target element
(default `<html>`). The consumer's CSS scopes every theme file to
`:root[data-theme="<slug>"]`:

```css
/* light.css */
:where(:root, :root[data-theme="light"]) {
  --theme-color-primary: #005eb8;
  --theme-color-background: #ffffff;
  --theme-color-text: #212529;
}
```

```css
/* dark.css */
:root[data-theme="dark"] {
  --theme-color-primary: #41b6e6;
  --theme-color-background: #0b0c0c;
  --theme-color-text: #f3f2f1;
}
```

The component code never sees these values; it only switches the
`data-theme` attribute (and the `<link>` href).

## Light / dark / high-contrast variants

`ThemePicker`'s `data-theme` is the activation switch. Each variant
is a separate theme file:

- `light.css` — default light theme.
- `dark.css` — dark variant.
- `high-contrast.css` — WCAG AAA contrast variant.
- `lily-{N}.css` — Lily's 41 DaisyUI-inspired themes.

The consumer drops the files into a directory and passes the
slugs to `ThemePicker`. Switching themes is a single attribute
write — no React state outside the picker, no Context, no
theme-provider re-render.

## Forbidden in the helper layer

These all live in consumer CSS and consume the theme CSS custom
properties:

- Hard-coded hex values, named colours, RGB / HSL literals.
- `font-family`, `font-size`, `line-height` declarations.
- `padding`, `margin`, `gap`, `width`, `height` literals.
- Breakpoint media queries.
- Shadow, border-radius, opacity values.

The helpers in this catalog set ARIA, semantic structure, class
hooks, and `data-*` attributes only.

## React-specific application

### No CSS-in-JS

The helpers do not ship CSS-in-JS solutions (styled-components,
emotion, vanilla-extract). The consumer's stylesheet handles all
styling. CSS-in-JS interop is the consumer's choice.

### No ThemeProvider context

The current React helper catalog does not ship a
`<ThemeProvider>` component. The headless library
(`lily-design-system-react-headless`) provides one if needed;
otherwise `ThemePicker` writes directly to `document.documentElement`
and consumer CSS reads from `:root[data-theme]`.

The absence of a context is intentional: `data-theme` on `<html>`
is the source of truth, and CSS selectors are the consumption
mechanism. No React re-renders happen on theme change.

### Server-resolved theme

For zero-flicker SSR, resolve the theme on the server (cookie,
header, session store) and seed the picker with `value`. See
`lily-design-system-react-theme-picker/docs/ssr.md` for the
Next.js App Router recipe.

```tsx
// app/layout.tsx — server
import { cookies } from "next/headers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const theme = (await cookies()).get("theme")?.value ?? "light";
    return (
        <html lang="en" data-theme={theme}>
            <head>
                <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
            </head>
            <body>{children}</body>
        </html>
    );
}
```

The picker then mounts with `value={theme}`, hydrates without
changing `data-theme`, and no flash occurs.

### Preloading multiple themes

For instant switching (designer / preview UI), drop a `<link>` per
theme in `<head>`. Each theme scopes its rules to
`:root[data-theme="<slug>"]`, so only the active rules apply. The
picker still mutates `data-theme`; the network round-trip is gone.

See
`lily-design-system-react-theme-picker/docs/preloading.md` for
strategies.

## Consumer-side patterns

### Following OS colour scheme

```tsx
"use client";

import { useEffect, useState } from "react";
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

### Live OS preference tracking

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

## See also

- Repo root `AGENTS/theme.md` — canonical cross-framework rules.
- `lily-design-system-react-theme-picker/docs/preloading.md` —
  three preloading strategies.
- `lily-design-system-react-theme-picker/docs/ssr.md` — cookie /
  Next.js / Remix SSR recipes.
- `lily-design-system-react-theme-picker/docs/styling.md` — class
  and attribute hooks.
