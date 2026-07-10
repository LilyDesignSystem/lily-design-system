# ThemeSelect (React helper)

A reusable, headless React 19 theme select that **loads themes
dynamically at runtime** from a developer-specified directory.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
human-readable guide. For topic deep-dives see [docs/](./docs/) and
for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [Install](#install)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Default theme](#default-theme)
- [Props](#props)
- [Custom option rendering](#custom-option-rendering)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [SSR and hydration](#ssr-and-hydration)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple selects in one app](#multiple-selects-in-one-app)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme selects couple selection, persistence, and styling into one
opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`) into
  a directory served by the app.
- **This component** owns selection, dynamic loading, persistence, and
  accessibility.
- **Consumers** own the visual style of the select via the
  `theme-select` class hook.

The result is a small reusable widget that works in any React 19 host
(Next.js App Router, Vite + React, Remix, Astro React islands,
Storybook) and against any theme catalog — Lily™'s 41 DaisyUI-inspired
themes, NHS-aligned themes, or your own bespoke set.

## Install

The directory is published as a folder-style import. Consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is `react` ≥ 19.

```ts
import { ThemeSelect } from "./lily-design-system-react-theme-select";
import type { Props, ChildArgs } from "./lily-design-system-react-theme-select";
```

## Quick start

1. Drop theme CSS files into a directory served by your app, e.g.
   `public/assets/themes/light.css`, `public/assets/themes/dark.css`.
   Each theme scopes its tokens to `:root[data-theme="<slug>"]`
   (the convention every Lily theme uses).
2. Render the select, pointing it at the directory and listing the
   available slugs.

```tsx
"use client";

import { useState } from "react";
import { ThemeSelect } from "./lily-design-system-react-theme-select";

export function ThemeChooser() {
    const [theme, setTheme] = useState("");
    return (
        <ThemeSelect
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark", "abyss"]}
            value={theme}
            onChange={setTheme}
            storageKey="lily-theme"
        />
    );
}
```

When the user picks `dark`, the component:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- calls the optional `onChange("dark")` callback.

## How it works

On every theme change the select performs four steps, in order:

1. **Locate or create** a managed
   `<link rel="stylesheet" data-lily-theme-select="{name}">` in
   `document.head`.
2. **Swap the href** to `${themesUrl}${slug}${extension}` so the new
   theme's CSS is fetched and applied. The previous theme's CSS is
   unloaded when the href changes.
3. **Set `data-theme="{slug}"`** on the resolved target element
   (defaults to `document.documentElement`). Theme CSS files match
   this attribute via their `:root[data-theme="…"]` selector.
4. **Persist + notify**: if `storageKey` is set, write to
   `localStorage` (silently swallowing private-mode errors); then call
   `onChange?.(slug)`.

All four steps are SSR-safe — the component only mutates the DOM
inside a `useEffect`, which never runs on the server.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`themes` list. The full resolution order on first mount is:

1. `value` prop (if non-empty, controlled mode)
2. `localStorage[storageKey]` (if `storageKey` is set and readable)
3. `defaultValue` prop
4. `"light"` (if present in `themes`)
5. `themes[0]`
6. `""` — nothing is applied; the select waits for user interaction

The select never displays the word `"default"`. Option labels default
to the slug with its first letter upper-cased
(e.g. `"light"` → `"Light"`); override with `themeLabels`.

## Props

The complete table is in [spec/index.md §4.1](./spec/index.md#41-props). Highlights:

| Prop           | Type                                     | Required | Notes                                      |
| -------------- | ---------------------------------------- | -------- | ------------------------------------------ |
| `label`        | `string`                                 | yes      | `aria-label` on the `<select>`.            |
| `themesUrl`    | `string`                                 | yes      | Trailing `/` is auto-added.                |
| `themes`       | `string[]`                               | yes      | Available slugs.                           |
| `value`        | `string`                                 | no       | Controlled value (omit for uncontrolled).  |
| `defaultValue` | `string`                                 | no       | Initial when nothing else applies.         |
| `storageKey`   | `string`                                 | no       | `localStorage` persistence.                |
| `name`         | `string`                                 | no       | `<select>` `name`; defaults to `"theme"`.  |
| `extension`    | `string`                                 | no       | Defaults to `".css"`.                      |
| `target`       | `HTMLElement \| null`                    | no       | `data-theme` target; defaults to `<html>`. |
| `themeLabels`  | `Record<string, string>`                 | no       | Per-slug display label override.           |
| `onChange`     | `(slug: string) => void`                 | no       | Callback fired after apply.                |
| `children`     | `(args: ChildArgs) => React.ReactNode`   | no       | Custom render prop for the options.        |

See [docs/props-reference.md](./docs/props-reference.md) for a
field-by-field reference.

## Custom option rendering

Pass a `children` render prop to take control of the `<option>`
markup. The render output goes inside the `<select>`, so it should
return `<option>` (or `<optgroup>`) elements. The function receives
`{ themes, value, setTheme, name, labelFor }`:

```tsx
<ThemeSelect
    label="Theme"
    themesUrl="/assets/themes/"
    themes={["light", "dark", "abyss"]}
    value={theme}
    onChange={setTheme}
>
    {({ themes, labelFor }) =>
        themes.map((t) => (
            <option key={t} className="theme-select-option" value={t}>
                {labelFor(t)}
            </option>
        ))
    }
</ThemeSelect>
```

For a different control entirely (swatch buttons, a segmented control),
render it outside the select and drive it with `setTheme`.

Working example: [`examples/custom-rendering.tsx`](./examples/custom-rendering.tsx).
Topic guide: [`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `storageKey` to persist the active slug to `localStorage`. On a
fresh mount the select reads back the stored slug as part of the
initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode, quota,
disabled storage) are silently swallowed — the select continues to
work in-memory.

If you need cookie-based persistence (so SSR can read the theme before
first paint), see [`docs/ssr.md`](./docs/ssr.md) and the
[`examples/next-cookie/`](./examples/next-cookie/) recipe.

## Accessibility

- The root is a native `<select>` (implicit `role="combobox"`) with
  `aria-label={label}`.
- The native `<select>` gives Arrow / Home / End / typeahead semantics
  for free; the select does not override any keyboard behaviour.
- The active state is exposed in two independent channels: the selected
  `<option>` (the select's `value`) and `data-theme` on the root. No
  colour-only meaning is required.
- WCAG 2.2 AAA is the target; visible focus styling is the consumer's
  CSS responsibility.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and hydration

The select compiles cleanly under Next.js App Router (server +
client components), Remix, and Vite SSR. On the server no effects
run and no DOM is touched, so the markup renders using whatever
`value` the consumer supplies.

For zero-flicker SSR, resolve the theme on the server (e.g. from a
cookie via `cookies()` in Next.js) and pass it as `value`. See
[`docs/ssr.md`](./docs/ssr.md) and the working example in
[`examples/next-cookie/`](./examples/next-cookie/).

## Preloading for zero-flicker switching

By default the select swaps one `<link>` href, so the active theme is
fetched on demand. To switch instantly between themes, preload them
all yourself:

```html
<link rel="stylesheet" href="/assets/themes/light.css" />
<link rel="stylesheet" href="/assets/themes/dark.css" />
<link rel="stylesheet" href="/assets/themes/abyss.css" />
```

The select still mutates `data-theme`, and since every theme's CSS is
scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/preloaded.tsx`](./examples/preloaded.tsx).

## Multiple selects in one app

Pass a distinct `name` prop to each select. The `name` is used as
both the `<select>` `name` and the discriminator on the managed
`<link>` element (`data-lily-theme-select="{name}"`).

Example: [`examples/multiple-selects.tsx`](./examples/multiple-selects.tsx).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in Next.js before render.
- Migrating from a `localStorage`-only select to a cookie-backed one.
- Building a flyout / dropdown UI around the select.
- Loading themes from a CDN.

## Troubleshooting

See [`docs/troubleshooting.md`](./docs/troubleshooting.md). Common
pitfalls:

- **CSS does not switch.** Check that each theme file scopes its rules
  to `:root[data-theme="<slug>"]` (not `:root` alone). Otherwise the
  first-loaded theme leaks across.
- **404 on theme href.** Check the file is served from `themesUrl` and
  uses the configured `extension` (defaults to `.css`).
- **SSR hydration mismatch.** Pass a server-resolved `value` (cookie)
  so the SSR markup matches what the effect will set on the client.
- **Theme does not persist.** Confirm `storageKey` is set and that
  `localStorage` is available (not blocked by private mode).
- **"useEffect / useState is null" or similar React errors.** Confirm
  the file using the select carries `"use client"` at the top —
  selects run as client components.

## Testing

`pnpm test` under a vitest + jsdom + `@testing-library/react` setup
exercises every numbered acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## Files in this directory

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Single source of truth — API, behaviour, tests.  |
| `ThemeSelect.tsx`          | The component implementation.                    |
| `ThemeSelect.test.tsx`     | vitest suite covering every spec §7 item.        |
| `index.ts`                 | Re-export barrel.                                |
| `index.md`                 | This file — quick start + worked examples.       |
| `CHANGELOG.md`             | Per-version history.                             |
| `AGENTS.md`                | AI-agent metadata pointer.                       |
| `AGENTS/`                  | Per-topic AI-agent guides.                       |
| `CLAUDE.md`                | Loads `AGENTS.md`.                               |
| `docs/`                    | Deep-dive guides — see [Documentation](#documentation). |
| `examples/`                | Runnable React 19 examples — see [Examples](#examples). |

## Documentation

| Guide                                                    | Covers                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------- |
| [docs/props-reference.md](./docs/props-reference.md)     | Field-by-field reference for every prop.                            |
| [docs/accessibility.md](./docs/accessibility.md)         | WCAG 2.2 AAA contract and keyboard map.                             |
| [docs/styling.md](./docs/styling.md)                     | Class hooks, attribute hooks, baseline CSS.                         |
| [docs/ssr.md](./docs/ssr.md)                             | Next.js App Router cookies, Remix loaders, Vite SSR.                |
| [docs/preloading.md](./docs/preloading.md)               | Three strategies for instant theme switching.                       |
| [docs/custom-rendering.md](./docs/custom-rendering.md)   | Taking over option markup via the `children` render prop.           |
| [docs/recipes.md](./docs/recipes.md)                     | Cookbook of adjacent problems.                                      |
| [docs/troubleshooting.md](./docs/troubleshooting.md)     | Symptoms, root causes, fixes.                                       |

## Examples

| #  | File                                                       | Demonstrates                              |
| -- | ---------------------------------------------------------- | ----------------------------------------- |
| 1  | [`basic.tsx`](./examples/basic.tsx)                        | Minimal three-theme select.               |
| 2  | [`two-way-binding.tsx`](./examples/two-way-binding.tsx)    | Controlled `value` + `onChange`.          |
| 3  | [`persistence.tsx`](./examples/persistence.tsx)            | `localStorage` survival across reloads.   |
| 4  | [`custom-labels.tsx`](./examples/custom-labels.tsx)        | `themeLabels` for i18n / display names.   |
| 5  | [`custom-rendering.tsx`](./examples/custom-rendering.tsx)  | `children` render prop — swatch buttons.  |
| 6  | [`preloaded.tsx`](./examples/preloaded.tsx)                | Zero-flicker switching via preloading.    |
| 7  | [`multiple-selects.tsx`](./examples/multiple-selects.tsx)  | Two selects in one page via `name`.       |
| 8  | [`system-preference.tsx`](./examples/system-preference.tsx) | Follow `prefers-color-scheme`.           |
| 9  | [`lily-themes.tsx`](./examples/lily-themes.tsx)            | All 41 Lily / DaisyUI themes at once.     |
| 10 | [`next-cookie/`](./examples/next-cookie/)                  | Next.js App Router SSR-resolved cookie.   |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
