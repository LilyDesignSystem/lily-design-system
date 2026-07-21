# AGENTS / ssr — ThemeChooser

SSR specifics for `ThemeChooser`. Read
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md) for the catalog-wide
contract; this file is the per-helper application.

## The directive

`ThemeChooser.tsx` is a **client component**. Every consumer file that
imports it should also carry `"use client"` if it touches React state
or hooks.

If `ThemeChooser.tsx` does not currently start with `"use client"`,
add it at the top:

```tsx
"use client";

import * as React from "react";
// …
```

The directive is enforced by the bundler under Next.js / Remix /
Vite SSR. Without it, the select compiles to a server boundary and
errors at runtime when `useState` / `useEffect` are called.

## What renders on the server

The select outputs deterministic HTML based purely on the resolved
`value`:

```html
<div class="theme-chooser">
    <input type="hidden" name="theme" value="light" />
    <button type="button" class="theme-chooser-button" aria-label="Theme"
            aria-haspopup="listbox" aria-expanded="false"
            aria-controls="theme-chooser-«r0»-list">
        <span class="theme-chooser-icon" aria-hidden="true">◑</span>
    </button>
    <ul class="theme-chooser-list" id="theme-chooser-«r0»-list" role="listbox"
        aria-label="Theme" tabindex="-1" hidden>
        <li class="theme-chooser-option" id="theme-chooser-«r0»-option-0"
            role="option" aria-selected="true">Light</li>
        <li class="theme-chooser-option" id="theme-chooser-«r0»-option-1"
            role="option" aria-selected="false">Dark</li>
    </ul>
</div>
```

The listbox always renders closed (`hidden`, `aria-expanded="false"`)
on the server. If `value` is supplied as a non-empty string, the
corresponding option carries `aria-selected="true"` and the hidden
input carries the slug; otherwise no option is selected.

Ids come from `useId`, so the server-generated ids match what the
client generates and hydration is clean. Do not replace them with
`Math.random()` / `Date.now()` if you fork.

## What happens on hydration

The first useEffect runs and:

1. Resolves the initial slug per `spec/index.md §5.2`.
2. If uncontrolled and the resolved slug differs from the current
   state, `setInternalValue(resolved)` triggers a re-render.
3. `applyTheme(slug)` injects/updates the managed `<link>` and
   writes `data-theme`.

If the resolved slug differs from what the server rendered (because
`localStorage` resolved to `dark` but the server defaulted to
`light`), the user sees one frame of unstyled (or wrongly themed)
content before the effect runs.

The fix is to pre-resolve the theme server-side and pass it via
`value`. See the cookie recipe below.

## Next.js App Router cookie recipe

Full working example in
[`../examples/next-cookie/`](../examples/next-cookie/). The shape is:

```tsx
// app/layout.tsx — SERVER component
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
// app/theme-client.tsx — CLIENT component
"use client";

import * as React from "react";
import { ThemeChooser } from "./lily-design-system-react-theme-chooser";

export function ThemeClient({
    initialTheme,
    children,
}: {
    initialTheme: string;
    children: React.ReactNode;
}) {
    const [theme, setTheme] = React.useState(initialTheme);

    function writeCookie(slug: string) {
        document.cookie =
            `theme=${slug}; path=/; max-age=31536000; SameSite=Lax`;
    }

    return (
        <>
            <ThemeChooser
                label="Theme"
                themesUrl="/assets/themes/"
                themes={["light", "dark", "abyss"]}
                value={theme}
                onChange={(slug) => {
                    setTheme(slug);
                    writeCookie(slug);
                }}
            />
            {children}
        </>
    );
}
```

Result:

- First paint: `<html data-theme="dark">` arrives in the HTML
  response with the dark theme's stylesheet already linked. No
  flash.
- Select mounts with `value="dark"` already correct; first-mount
  effect re-applies (no visible change).
- User picks `light`. Select writes `data-theme="light"` and the
  cookie; next request re-paints the page in light from byte zero.

## Remix loader recipe

```tsx
// app/root.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
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

`ThemeClient` is the same client component as in the Next.js
example.

## Vite SSR / plain React

Without a server framework there's no first-paint problem worth
solving — the select hydrates from `localStorage` before content
renders if you mount it at the top of `<body>`. Avoid styles
depending on `data-theme` for the first paint, or hard-code the
default theme's `<link>` in `index.html`.

## Common pitfalls

### "Hydration mismatch: Server rendered X but client rendered Y"

**Cause.** The select's effect resolved a slug different from what
the server rendered (because the server used `value="light"` but
`localStorage` has `"dark"`).

**Fix.** The select must mount with the value that the server
rendered. If you're using `localStorage`, switch to a cookie so the
server can read it.

### "ReferenceError: document is not defined"

**Cause.** Helper code accessed `document` outside `useEffect`.

**Fix.** Wrap with `typeof document !== "undefined"` or move into
`useEffect`. The Lily select already does this; if you fork, keep
the guards.

### "use client must be at the top of the file"

**Cause.** The directive is after an import or comment block.

**Fix.** Place `"use client";` as the first non-blank line.

## Streaming SSR

React 19's streaming SSR fires effects only after the relevant
chunk hydrates. The select's first-mount effect runs once per
component instance after that chunk's hydration completes. No
special handling needed.

If the consumer streams a fragment that needs its own theme, wrap
it in an element with explicit `data-theme` and `<link>` so the
fragment is themed correctly before hydration completes.

## Checklist for SSR adoption

- [ ] `ThemeChooser.tsx` starts with `"use client"`.
- [ ] Server reads the cookie and writes `<html data-theme>`.
- [ ] Server inlines the active theme's `<link rel="stylesheet">`.
- [ ] Client component receives the resolved theme via props and
      passes it as `value` to the select.
- [ ] `onChange` writes the cookie (via `document.cookie` or a
      server action).
- [ ] Storage key (if used) is for cross-tab convenience only, not
      for SSR correctness.

## References

- React 19 — Client Components:
  <https://react.dev/reference/rsc/use-client>
- Next.js App Router — `cookies()`:
  <https://nextjs.org/docs/app/api-reference/functions/cookies>
- Remix — Cookies:
  <https://remix.run/docs/en/main/utils/cookies>
