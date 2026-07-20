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
- [The rendered markup](#the-rendered-markup)
- [How it works](#how-it-works)
- [Keyboard](#keyboard)
- [Default theme](#default-theme)
- [Props](#props)
- [Custom button glyph](#custom-button-glyph)
- [Persistence](#persistence)
- [Following the OS colour scheme](#following-the-os-colour-scheme)
- [Exported helpers](#exported-helpers)
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
import {
    ThemeSelect,
    themeName,
} from "./lily-design-system-react-theme-select";

export function ThemeChooser() {
    const [theme, setTheme] = useState("");
    return (
        <>
            <ThemeSelect
                label="Theme"
                themesUrl="/assets/themes/"
                themes={["light", "dark", "abyss"]}
                value={theme}
                onChange={setTheme}
                storageKey="lily-theme"
            />

            <p className="theme-select-status" aria-live="polite">
                Active theme: {themeName(theme)}
            </p>
        </>
    );
}
```

The status line is part of the pattern, not an optional extra. The
closed control is an icon button showing only a glyph — it never states
the active theme — so without this line the active theme is announced to
nobody and shown to nobody. `aria-live="polite"` announces mutations
only, so it stays quiet on first paint and speaks once per user change.
Keep it visible where you can (it helps sighted and cognitively-loaded
users too); if your design cannot spare the space, hide it with the
visually-hidden recipe in [docs/styling.md](./docs/styling.md) rather
than dropping it. Full rationale:
[docs/accessibility.md](./docs/accessibility.md).

When the user picks `dark`, the component:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- calls the optional `onChange("dark")` callback.

## The rendered markup

The control is an icon button that opens a dropdown listbox, following
the WAI-ARIA APG listbox pattern:

```html
<div class="theme-select">
    <input type="hidden" name="theme" value="light" />
    <button type="button" class="theme-select-button" aria-label="Theme"
            aria-haspopup="listbox" aria-expanded="false"
            aria-controls="theme-select-«r0»-list">
        <span class="theme-select-icon" aria-hidden="true">◑</span>
    </button>
    <ul class="theme-select-list" id="theme-select-«r0»-list" role="listbox"
        aria-label="Theme" tabindex="-1" hidden>
        <li class="theme-select-option" id="theme-select-«r0»-option-0"
            role="option" aria-selected="true" data-active>Light</li>
        <li class="theme-select-option" id="theme-select-«r0»-option-1"
            role="option" aria-selected="false">Dark</li>
        <li class="theme-select-option" id="theme-select-«r0»-option-2"
            role="option" aria-selected="false">Abyss</li>
    </ul>
</div>
```

Notes:

- The glyph is **U+25D1 CIRCLE WITH RIGHT HALF BLACK** (`◑`,
  `&#9681;`), exported from `ThemeSelect.tsx` as
  `CIRCLE_WITH_RIGHT_HALF_BLACK`. It is `aria-hidden`, so the button's
  accessible name comes entirely from the `label` prop.
- The hidden `<input>` carries the active slug under the `name` prop, so
  the control still submits with a surrounding form.
- Ids come from React's `useId`, so they are stable and hydration-safe.
- While open, the listbox carries `aria-activedescendant` pointing at
  the active option, and that option carries `data-active`.
- The listbox is toggled with the `hidden` attribute. The package ships
  no CSS, so **you** supply the positioning — see
  [docs/styling.md](./docs/styling.md).

The closed button shows only the glyph; it never states the active
theme. That is why the quick start above pairs it with a
`.theme-select-status` live region — pairing them is the default
pattern, and dropping the status line is the deliberate opt-out. See
[docs/accessibility.md](./docs/accessibility.md).

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

## Keyboard

The component implements the whole contract itself; nothing is
inherited from a native `<select>`.

On the **button**:

| Key                             | Action                                              |
| ------------------------------- | --------------------------------------------------- |
| `Tab` / `Shift+Tab`             | Move focus to / from the button (one tab stop).     |
| `ArrowDown` / `Enter` / `Space` | Open, with the active theme's option active (or the first). Focus moves to the list. |
| `ArrowUp`                       | Open with the **last** option active.               |

On the **listbox**:

| Key                     | Action                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends — it does not wrap. |
| `Home` / `End`          | Jump to the first / last option.                               |
| `Enter` / `Space`       | Select the active option, apply it, close, and return focus to the button. |
| `Escape`                | Close and return focus to the button, leaving the theme unchanged. |
| `Tab`                   | Close and let focus move on.                                    |
| Any printable character | Typeahead over the option labels; the buffer accumulates and resets after 500 ms of inactivity. |

With the mouse: click an option to select it; click the button again,
click outside, or move focus out of the control to close it without
changing anything.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`themes` list. The full resolution order on first mount is:

1. `value` prop (if non-empty, controlled mode)
2. `localStorage[storageKey]` (if `storageKey` is set and readable)
3. `matchSystemTheme(themes)` (only when `detectFromSystem` is set)
4. `defaultValue` prop
5. `"light"` (if present in `themes`)
6. `themes[0]`
7. `""` — nothing is applied; the select waits for user interaction

The select never displays the word `"default"`. Option labels default
to the slug with each hyphen-separated word title-cased
(e.g. `"light"` → `"Light"`, `"high-contrast"` → `"High Contrast"`);
override with `themeLabels`.

## Props

The complete table is in [spec/index.md §4.1](./spec/index.md#41-props). Highlights:

| Prop           | Type                                     | Required | Notes                                      |
| -------------- | ---------------------------------------- | -------- | ------------------------------------------ |
| `label`        | `string`                                 | yes      | `aria-label` on the button and the listbox. |
| `themesUrl`    | `string`                                 | yes      | Trailing `/` is auto-added.                |
| `themes`       | `string[]`                               | yes      | Available slugs.                           |
| `value`        | `string`                                 | no       | Controlled value (omit for uncontrolled).  |
| `defaultValue` | `string`                                 | no       | Initial when nothing else applies.         |
| `storageKey`   | `string`                                 | no       | `localStorage` persistence.                |
| `detectFromSystem` | `boolean`                            | no       | Resolve `prefers-color-scheme` on first visit; defaults to `false`. |
| `name`         | `string`                                 | no       | Hidden input `name` + managed `<link>` discriminator; defaults to `"theme"`. |
| `extension`    | `string`                                 | no       | Defaults to `".css"`.                      |
| `target`       | `HTMLElement \| null`                    | no       | `data-theme` target; defaults to `<html>`. |
| `themeLabels`  | `Record<string, string>`                 | no       | Per-slug display label override.           |
| `onChange`     | `(slug: string) => void`                 | no       | Callback fired after apply.                |
| `children`     | `(args: ChildArgs) => React.ReactNode`   | no       | Replaces the glyph inside the button.      |

See [docs/props-reference.md](./docs/props-reference.md) for a
field-by-field reference.

## Custom button glyph

Pass a `children` render prop to replace the half-circle glyph inside
the button. It does **not** render the options — the component owns
those, their ids, their ARIA state, and the keyboard contract. The
function receives `{ value, open, labelFor }`:

```tsx
<ThemeSelect
    label="Theme"
    themesUrl="/assets/themes/"
    themes={["light", "dark", "abyss"]}
    value={theme}
    onChange={setTheme}
>
    {({ value, open, labelFor }) => (
        <>
            <span
                className="theme-select-swatch"
                data-theme={value}
                aria-hidden="true"
            />
            <span aria-hidden="true">{labelFor(value)}</span>
            <span aria-hidden="true">{open ? "▴" : "▾"}</span>
        </>
    )}
</ThemeSelect>
```

Keep custom glyph content `aria-hidden` — the button's accessible name
comes from `label`, and visible text that disagrees with it is a
"Label in Name" hazard.

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

## Following the OS colour scheme

Pass `detectFromSystem` to resolve `prefers-color-scheme` on a first
visit — when there is no `value` and nothing in storage:

```tsx
<ThemeSelect
    label="Theme"
    themesUrl="/assets/themes/"
    themes={["light", "dark"]}
    detectFromSystem
    storageKey="lily-theme"
/>
```

Storage beats detection, so a user who has explicitly picked a theme
keeps it even if their OS says otherwise. Detection resolves once, at
mount; to keep tracking the OS as it changes, add a `matchMedia`
listener and write to a controlled `value` — see
[`examples/system-preference.tsx`](./examples/system-preference.tsx).

This mirrors `detectFromNavigator` in the sibling
[locale-select](../lily-design-system-react-locale-select/) helper.

## Exported helpers

Besides the component, the barrel exports four pure functions:

| Export                   | Purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `themeName(slug)`        | The title-casing label rule — `"high-contrast"` → `"High Contrast"`. The component's internal `labelFor` delegates to it, so use it rather than re-deriving the rule. Mirrors `localeName` in locale-select. |
| `matchSystemTheme(themes)` | Resolves `prefers-color-scheme` to a supported slug, or `""` when the slug is absent or `matchMedia` is unavailable (SSR). Backs `detectFromSystem`. Mirrors `matchNavigatorLanguage` in locale-select. |
| `normalizeThemesUrl(url)` | Ensures exactly one trailing `/`.                              |
| `themeHref(url, slug, ext)` | Builds the stylesheet href for a slug.                       |

`ThemeSelect.tsx` also exports `CIRCLE_WITH_RIGHT_HALF_BLACK`, the
default button glyph (U+25D1), so a `children` override can re-use the
exact character.

## Accessibility

- The control follows the WAI-ARIA APG listbox pattern: a button with
  `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls`, and a
  `<ul role="listbox">` that tracks the active option with
  `aria-activedescendant`.
- `aria-label={label}` names both the button and the listbox. The glyph
  is `aria-hidden`, so `label` is the only accessible name the control
  has — it is not optional.
- The component implements the full keyboard contract itself (see
  [Keyboard](#keyboard)) and returns focus to the button when a
  selection or `Escape` closes the list.
- The active state is exposed in three independent channels:
  `aria-selected` on the option, `data-active` on the keyboard-active
  option, and `data-theme` on the target. No colour-only meaning is
  required.
- WCAG 2.2 AAA is the target; visible focus styling is the consumer's
  CSS responsibility — for the button **and** for the listbox, which
  takes focus while open.
- A custom listbox does not get the platform-level assistive-technology
  treatment a native `<select>` does. Read
  [`docs/accessibility.md`](./docs/accessibility.md) for the honest
  tradeoffs before shipping.

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
both the hidden input's `name` and the discriminator on the managed
`<link>` element (`data-lily-theme-select="{name}"`).

Example: [`examples/multiple-selects.tsx`](./examples/multiple-selects.tsx).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in Next.js before render.
- Migrating from a `localStorage`-only select to a cookie-backed one.
- Positioning the dropdown listbox.
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
- **The dropdown renders inline and pushes the page around.** The
  package ships no CSS: give the root `position: relative` and the list
  `position: absolute`. See [docs/styling.md](./docs/styling.md).

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
| [docs/accessibility.md](./docs/accessibility.md)         | WCAG 2.2 AAA contract, keyboard map, and the pattern's tradeoffs.   |
| [docs/styling.md](./docs/styling.md)                     | Class hooks, attribute hooks, positioning, baseline CSS.            |
| [docs/ssr.md](./docs/ssr.md)                             | Next.js App Router cookies, Remix loaders, Vite SSR.                |
| [docs/preloading.md](./docs/preloading.md)               | Three strategies for instant theme switching.                       |
| [docs/custom-rendering.md](./docs/custom-rendering.md)   | Replacing the button glyph via the `children` render prop.          |
| [docs/recipes.md](./docs/recipes.md)                     | Cookbook of adjacent problems.                                      |
| [docs/troubleshooting.md](./docs/troubleshooting.md)     | Symptoms, root causes, fixes.                                       |

## Examples

| #  | File                                                       | Demonstrates                              |
| -- | ---------------------------------------------------------- | ----------------------------------------- |
| 1  | [`basic.tsx`](./examples/basic.tsx)                        | Minimal three-theme select + the default status line. |
| 2  | [`two-way-binding.tsx`](./examples/two-way-binding.tsx)    | Controlled `value` + `onChange`.          |
| 3  | [`persistence.tsx`](./examples/persistence.tsx)            | `localStorage` survival across reloads.   |
| 4  | [`custom-labels.tsx`](./examples/custom-labels.tsx)        | `themeLabels` for i18n / display names.   |
| 5  | [`custom-rendering.tsx`](./examples/custom-rendering.tsx)  | `children` render prop — custom button glyph. |
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
