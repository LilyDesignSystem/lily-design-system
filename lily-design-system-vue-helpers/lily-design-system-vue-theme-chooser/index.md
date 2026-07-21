# ThemeChooser (Vue helper)

A reusable, headless Vue 3 theme chooser that **loads themes
dynamically at runtime** from a developer-specified directory.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
comprehensive user guide. For topic deep-dives see
[docs/](./docs/) and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [Install](#install)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Default theme](#default-theme)
- [Props](#props)
- [Events](#events)
- [Custom button glyph](#custom-button-glyph)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [SSR and hydration](#ssr-and-hydration)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple choosers in one app](#multiple-choosers-in-one-app)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme choosers couple selection, persistence, and styling into one
opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`) into
  a directory served by the app.
- **This component** owns selection, dynamic loading, persistence, and
  accessibility.
- **Consumers** own the visual style of the chooser via the
  `theme-chooser` class hook.

The result is a small reusable widget that works in any Vue 3 host
(Nuxt 3, plain Vite + Vue, Astro Vue islands, Storybook) and against
any theme catalog — Lily™'s 45 ready-to-use themes, NHS-aligned
themes, or your own bespoke set.

The component is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-chooser`. APIs and behaviour match;
only the framework idioms differ.

## Install

The directory is published as a folder-style import. Consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is `vue` ≥ 3.

```ts
import ThemeChooser from "./lily-design-system-vue-theme-chooser/ThemeChooser.vue";
// or via the barrel:
import { ThemeChooser } from "./lily-design-system-vue-theme-chooser";
import type { Props, SlotArgs } from "./lily-design-system-vue-theme-chooser";
```

The barrel also exports the pure helpers `normaliseThemesUrl`,
`themeHref`, and `nextThemeChooserId`, the default glyph constant
`CIRCLE_WITH_RIGHT_HALF_BLACK`, and the `ChildArgs` type (an alias of
`SlotArgs`).

## Quick start

1. Drop theme CSS files into a directory served by your app, e.g.
   `public/assets/themes/light.css`,
   `public/assets/themes/dark.css`. Each theme scopes its tokens to
   `:root[data-theme="<slug>"]` (the convention every Lily theme
   uses).
2. Render the chooser, pointing it at the directory and listing the
   available slugs.

```vue
<script setup lang="ts">
import { ref } from "vue";
import ThemeChooser from "./lily-design-system-vue-theme-chooser/ThemeChooser.vue";

const theme = ref("");

function labelFor(slug: string): string {
    return slug.charAt(0).toUpperCase() + slug.slice(1);
}
</script>

<template>
    <ThemeChooser
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
        v-model:value="theme"
        storage-key="lily-theme"
    />

    <p class="theme-chooser-status" aria-live="polite">
        Active theme: {{ labelFor(theme) }}
    </p>
</template>
```

The status line is part of the quick start on purpose. The control is
an icon-only button — it shows a glyph and nothing else — so the
status region is the only channel that surfaces the active theme, on
screen or to a screen reader. It is visible by default (sighted and
cognitive-accessibility users benefit too), and `aria-live="polite"`
means it stays silent on first paint and speaks once per change.
Opting out is a deliberate decision, not the default; see
[`docs/accessibility.md`](./docs/accessibility.md) for the full
tradeoff and [`docs/styling.md`](./docs/styling.md) for the
visually-hidden variant.

You will also need a little CSS before the control behaves like a
dropdown: the package ships none, including no positioning, so the
listbox opens in normal document flow and pushes the page down. See
[Positioning the listbox](./docs/styling.md#positioning-the-listbox).

When the user picks `dark`, the component:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- emits `update:value` (driving `v-model:value`),
- emits `change` with the new slug,
- closes the listbox and returns focus to the button.

## The rendered markup

The control is a button that opens a WAI-ARIA APG listbox:

```html
<div class="theme-chooser">
    <input type="hidden" name="theme" value="dark" />
    <button type="button" class="theme-chooser-button" aria-label="Theme"
            aria-haspopup="listbox" aria-expanded="false"
            aria-controls="theme-chooser-1-list">
        <span class="theme-chooser-icon" aria-hidden="true">◑</span>
    </button>
    <ul class="theme-chooser-list" id="theme-chooser-1-list" role="listbox"
        aria-label="Theme" tabindex="-1" hidden>
        <li class="theme-chooser-option" id="theme-chooser-1-option-0"
            role="option" aria-selected="false">Light</li>
        <li class="theme-chooser-option" id="theme-chooser-1-option-1"
            role="option" aria-selected="true">Dark</li>
        <li class="theme-chooser-option" id="theme-chooser-1-option-2"
            role="option" aria-selected="false">Abyss</li>
    </ul>
</div>
```

Points worth knowing:

- The default glyph is `◑` (U+25D1 CIRCLE WITH RIGHT HALF BLACK),
  exported as `CIRCLE_WITH_RIGHT_HALF_BLACK`. It is `aria-hidden`, so
  the button's accessible name comes entirely from `label`.
- The trigger stays one glyph wide no matter how long the theme names
  are — useful when your catalog includes entries like
  `united-kingdom-national-health-service-england-for-patients`.
- The hidden input keeps the control working inside a `<form>`; its
  `name` comes from the `name` prop.
- The listbox is always in the DOM, closed via the `hidden` attribute.
  While open, the `<ul>` holds focus and points at the keyboard-active
  option with `aria-activedescendant`; the options themselves are never
  focused.
- `$attrs` falls through to the root `<div>` — so `id`, `data-*`, and
  event handlers land on the wrapper, not on the button.

No user-facing string is hardcoded: labels come from `label` and
`themeLabels`.

> **Upgrading from 0.3.0?** The `placeholder` prop is removed, the
> `.theme-chooser-placeholder` class hook is gone, and the default slot
> now replaces the button glyph rather than the options. See
> [`CHANGELOG.md`](./CHANGELOG.md).

## How it works

On every theme change the chooser performs four steps, in order:

1. **Locate or create** a managed
   `<link rel="stylesheet" data-lily-theme-chooser="{name}">` in
   `document.head`.
2. **Swap the href** to `${themesUrl}${slug}${extension}` so the new
   theme's CSS is fetched and applied. The previous theme's CSS is
   unloaded when the href changes.
3. **Set `data-theme="{slug}"`** on the resolved target element
   (defaults to `document.documentElement`). Theme CSS files match
   this attribute via their `:root[data-theme="…"]` selector.
4. **Persist + notify**: if `storageKey` is set, write to
   `localStorage` (silently swallowing private-mode errors); then
   emit `change` with the slug.

All four steps are SSR-safe — the component only mutates the DOM
inside `onMounted` / `watch`, which never run on the server.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`themes` list. The full resolution order on first mount is:

1. `value` prop (if non-empty)
2. `localStorage[storageKey]` (if `storageKey` is set and readable)
3. `defaultValue` prop
4. `"light"` (if present in `themes`)
5. `themes[0]`
6. `""` — nothing is applied; the chooser waits for user interaction

The chooser never displays the word `"default"`. Option labels default
to the slug with its first letter upper-cased
(e.g. `"light"` → `"Light"`); override with `themeLabels`.

## Props

The complete table is in [spec/index.md §4.1](./spec/index.md#41-props). Highlights:

| Prop           | Type                     | Required | Notes                                      |
| -------------- | ------------------------ | -------- | ------------------------------------------ |
| `label`        | `string`                 | yes      | `aria-label` on both the button and the listbox. The button is icon-only, so this is its only name. |
| `themesUrl`    | `string`                 | yes      | Trailing `/` is auto-added.                |
| `themes`       | `string[]`               | yes      | Available slugs, in keyboard order.        |
| `value`        | `string` (`v-model`)     | no       | Two-way bind for the current slug.         |
| `defaultValue` | `string`                 | no       | Initial when nothing else applies.         |
| `storageKey`   | `string`                 | no       | `localStorage` persistence.                |
| `name`         | `string`                 | no       | Hidden input `name` + managed `<link>` discriminator; defaults to `"theme"`. |
| `extension`    | `string`                 | no       | Defaults to `".css"`.                      |
| `target`       | `HTMLElement \| null`    | no       | `data-theme` target; defaults to `<html>`. |
| `themeLabels`  | `Record<string, string>` | no       | Per-slug display label override.           |
| `class`        | `string`                 | no       | Extra class on the root `<div>`.           |

There is no `placeholder` prop — it was removed with the `<select>`.

See [docs/props-reference.md](./docs/props-reference.md) for a
field-by-field reference.

## Events

| Event           | Payload  | When                                                  |
| --------------- | -------- | ----------------------------------------------------- |
| `update:value`  | `string` | After selection, drives `v-model:value`.              |
| `change`        | `string` | After the chooser applies a new theme (post-DOM-write). |

## Custom button glyph

Pass a default slot to replace the `◑` glyph inside the trigger
button. The slot receives `{ value, open, labelFor }`:

```vue
<ThemeChooser
    label="Theme"
    themes-url="/assets/themes/"
    :themes="['light', 'dark', 'abyss']"
    v-model:value="theme"
>
    <template #default="{ value, open, labelFor }">
        <span
            class="theme-chooser-swatch"
            :data-theme="value"
            :title="labelFor(value)"
            aria-hidden="true"
        />
        <span class="theme-chooser-caret" aria-hidden="true">{{ open ? "▴" : "▾" }}</span>
    </template>
</ThemeChooser>
```

The slot replaces the **glyph only** — not the options. The listbox,
its `<li role="option">` children, the keyboard contract, and the apply
lifecycle stay component-owned. Whatever you render is decorative: the
button's accessible name always comes from `label` via `aria-label`, so
keep slot content `aria-hidden="true"` or text-free, and never put
interactive markup inside it (it renders inside the `<button>`).

The most common reason to use the slot is to swap the font-dependent
`◑` for an inline SVG that renders identically everywhere.

Working example: [`examples/custom-rendering.vue`](./examples/custom-rendering.vue).
Topic guide: [`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `storageKey` to persist the active slug to `localStorage`. On
a fresh mount the chooser reads back the stored slug as part of the
initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode,
quota, disabled storage) are silently swallowed — the chooser
continues to work in-memory.

If you need cookie-based persistence (so SSR can read the theme
before first paint), see [`docs/ssr.md`](./docs/ssr.md) and the
[`examples/nuxt-cookie/`](./examples/nuxt-cookie/) recipe.

## Accessibility

- The trigger is a `<button aria-haspopup="listbox" aria-expanded
  aria-controls>` whose accessible name is `aria-label={label}`. It is
  icon-only, so `label` is its *only* name — the glyph is
  `aria-hidden`.
- The popup is a `<ul role="listbox" aria-label={label}>` of
  `<li role="option" aria-selected>`. Focus moves to the `<ul>` on
  open, and the keyboard-active option is conveyed with
  `aria-activedescendant`, per the WAI-ARIA APG listbox pattern.
- The component implements the whole keyboard contract itself:

  | Where    | Keys                                                             |
  | -------- | ---------------------------------------------------------------- |
  | Button   | `ArrowDown` / `Enter` / `Space` open; `ArrowUp` opens on the last option |
  | Listbox  | `ArrowUp` / `ArrowDown` (clamping), `Home` / `End`, `Enter` / `Space` to commit, `Escape` to cancel, `Tab` to close, printable-character typeahead |

- The active state is exposed in three independent channels:
  `data-theme` on the target, the `value` binding, and the hidden
  input. No colour-only meaning is required.
- Style `[data-active]`, not just `[aria-selected]` — with focus on the
  `<ul>`, `[data-active]` is the only visible cue a keyboard user gets.
- WCAG 2.2 AAA is the target; visible focus styling is the consumer's
  CSS responsibility, on both the button and the open list.

**Three tradeoffs come with this design** and are argued in full in
[`docs/accessibility.md`](./docs/accessibility.md):

1. The control is icon-only, so a wrong or untranslated `label` leaves
   it unnamed, and WCAG 2.5.3 (Label in Name) has no visible text to
   match against.
2. A scripted listbox has weaker real-world assistive-technology
   support than a native `<select>` — no platform-tested behaviour, no
   OS picker on mobile, uneven forms-mode handling. That is a genuine
   robustness regression traded for a compact, consistent, styleable
   control.
3. The `◑` glyph depends on the user's fonts and may be re-weighted,
   substituted, or missing entirely. Ship your own SVG via the slot if
   that matters.

The compensating pattern is the visible `.theme-chooser-status` region
with `aria-live="polite"` — shipped in the quick start and in
[`examples/basic.vue`](./examples/basic.vue). Removing it is the
deliberate choice.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and hydration

The chooser compiles cleanly under Vue 3 SSR (Nuxt, plain
`vue/server-renderer`, Astro Vue islands). On the server no
lifecycle hook runs and no DOM is touched, so the markup renders
using whatever `value` (or empty string) the consumer supplies.

For zero-flicker SSR, resolve the theme on the server (e.g. from a
cookie) and pass it as `value`. See
[`docs/ssr.md`](./docs/ssr.md) and
[`examples/nuxt-cookie/`](./examples/nuxt-cookie/).

## Preloading for zero-flicker switching

By default the chooser swaps one `<link>` href, so the active theme
is fetched on demand. To switch instantly between themes, preload
them all yourself:

```html
<link rel="stylesheet" href="/assets/themes/light.css">
<link rel="stylesheet" href="/assets/themes/dark.css">
<link rel="stylesheet" href="/assets/themes/abyss.css">
```

The chooser still mutates `data-theme`, and since every theme's CSS
is scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/preloaded.vue`](./examples/preloaded.vue).

## Multiple choosers in one app

Pass a distinct `name` prop to each chooser. The `name` is used as
both the hidden input's `name` (so form submissions stay distinct) and
the discriminator on the managed `<link>` element
(`data-lily-theme-chooser="{name}"`). Give each a distinct `label` too:
with icon-only triggers, two buttons both named "Theme" are
indistinguishable to a screen-reader user.

Example: [`examples/multiple-choosers.vue`](./examples/multiple-choosers.vue).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in Nuxt before render.
- Migrating from a `localStorage`-only select to a cookie-backed one.
- Replacing the button glyph with your own icon.
- Building a completely different theme UI on top of the same
  lifecycle.
- Loading themes from a CDN.

## Troubleshooting

See [`docs/troubleshooting.md`](./docs/troubleshooting.md). Common
pitfalls:

- **The listbox shoves the page down when it opens.** The package
  ships no CSS, including no positioning. Add `position: relative` to
  `.theme-chooser` and `position: absolute` to `.theme-chooser-list`.
- **Arrowing looks like it does nothing.** Style
  `.theme-chooser-option[data-active]` — focus is on the `<ul>`, not on
  the options.
- **CSS does not switch.** Check that each theme file scopes its
  rules to `:root[data-theme="<slug>"]` (not `:root` alone).
  Otherwise the first-loaded theme leaks across.
- **404 on theme href.** Check the file is served from `themesUrl`
  and uses the configured `extension` (defaults to `.css`).
- **SSR mismatch warning.** Pass a server-resolved `value` (cookie)
  so the SSR markup matches what the lifecycle hook will set on the
  client.
- **Theme does not persist.** Confirm `storageKey` is set and that
  `localStorage` is available (not blocked by private mode).

## Testing

`pnpm test` under a vitest + jsdom + `@vue/test-utils` setup
exercises every numbered acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## Files in this directory

| File                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `spec/index.md`             | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`           | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`             | Topic-by-topic agent files.                      |
| `CLAUDE.md`           | `@AGENTS.md`.                                    |
| `ThemeChooser.vue`     | The component implementation.                    |
| `ThemeChooser.test.ts` | vitest suite covering every spec §7 item.        |
| `index.ts`            | Re-export barrel.                                |
| `index.md`            | This file.                                       |
| `docs/`               | Deep-dive topic guides.                          |
| `examples/`           | Runnable Vue 3 SFCs.                             |
| `CHANGELOG.md`        | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
